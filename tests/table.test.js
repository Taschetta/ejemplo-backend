import { expect } from "@jest/globals";
import { format, raw } from "mysql";
import { useTable } from "../packages/database/table/index.js";

let database = {}
let table = {}

describe('the table module', () => {
  
  beforeEach(() => {
    database = fakeDatabase()
    table = useTable({ database })({ name: 'test' })
  })

  describe('find', () => {
  
    describe('table.findMany(filters, options)', () => {
      
      it('selects every row from the table', async () => {
        await table.findMany()
        checkQuery('SELECT * FROM `test`')
      })

      it('returns them', async () => {
        const expectedResult = [{ id: 'a', nombre: 'pedro' }]
        fakeResultOnce(expectedResult)
        const result = await table.findMany()
        expect(result).toEqual(expectedResult)
      })

      testFilters({
        method: 'findMany', 
        queryStart: 'SELECT * FROM `test`',
      })

      // describe('when it recibes a filters object', () => {
        
      //   describe('an it has a property of type number', () => {
          
      //     it('searches exactly by that number', async () => {
      //       await table.findMany({ id: 10 })
      //       checkQuery('SELECT * FROM `test` WHERE `id` = 10')
      //     })
          
      //   })

      //   describe('an it has a property of type boolean', () => {
          
      //     it('searches exactly by that number', async () => {
      //       await table.findMany({ id: true })
      //       checkQuery('SELECT * FROM `test` WHERE `id` = true')
      //     })
          
      //   })

      //   describe('and it has a property of type string', () => {
          
      //     it('searches for rows like that string', async () => {
      //       await table.findMany({ codigo: 'ABC' })
      //       checkQuery("SELECT * FROM `test` WHERE `codigo` LIKE '%ABC%'")
      //     })
          
      //   })
        
      //   describe('and it has a property of type object', () => {
          
      //     describe('and the object has a property with name $exact', () => {
            
      //       it('searches exactly by its value', async () => {
      //         await table.findMany({ id: { $exact: 10 } })
      //         checkQuery('SELECT * FROM `test` WHERE `id` = 10')
      //       })
            
      //     })  

      //     describe('and the object has a property with name $like', () => {
            
      //       it('searches partially by its value', async () => {
      //         await table.findMany({ codigo: { $like: 'ABC' } })
      //         checkQuery("SELECT * FROM `test` WHERE `codigo` LIKE '%ABC%'")
      //       })
            
      //     })  
          
      //   })
        
      // })

      describe('when it recibes an options object', () => {
        
        describe('and it has a fields array', () => {

          it('selects only the columns present on the array', async () => {
            await table.findMany({}, { fields: ['id', 'name'] })
            checkQuery('SELECT `id`, `name` FROM `test`')
          })
          
        })
        
        describe('and it has a sort_by property', () => {
          
          it('orders the query by its value', async () => {
            await table.findMany({}, { sort_by: 'code' })
            checkQuery('SELECT * FROM `test` ORDER BY `code` ASC')
          })
          
        })

        describe('and it has a sort_order property', () => {
          
          it('orders the sort by its value (asc | desc)', async () => {
            
          })
          
        })

        describe('and it has a paginate property', () => {

          beforeEach(() => {
            fakeResultOnce([{ id: 1, name: 'test' }])
            fakeResultOnce([{ 'COUNT(*)': 1 }])
          })

          it('paginates the results', async () => {
            process.env.PAGE_SIZE='10'
            await table.findMany({}, { paginate: true })
            checkQuery('SELECT * FROM `test` LIMIT 10')          
          })
          
        })

        describe('and it has a page_size property', () => {
          
          beforeEach(() => {
            fakeResultOnce([{ id: 1, name: 'test' }])
            fakeResultOnce([{ 'COUNT(*)': 1 }])
          })

          it('limits the querys result by page_size', async () => {
            await table.findMany({}, { paginate: true, page_size: 5 })
            checkQuery('SELECT * FROM `test` LIMIT 5')
          })
          
        })

        describe('and it has a page property', () => {
          
          beforeEach(() => {
            fakeResultOnce([{ id: 1, name: 'test' }])
            fakeResultOnce([{ 'COUNT(*)': 1 }])
          })

          it('limits the results to 10 and offsets them ((page - 1) * 10)', async () => {
            await table.findMany({}, { paginate: true, page: 3 })
            checkQuery('SELECT * FROM `test` LIMIT 10 OFFSET 20')
          })
          
        })
        
      })

    })

    describe('table.findOne(filters, options)', () => {
      
      let queryResult = []
      
      beforeEach(() => {
        queryResult = fakeResult([{ id: 'a', nombre: 'pedro' }])
      })
      
      it('selects the first row from the table', async () => {
        await table.findOne()
        checkQuery('SELECT * FROM `test` LIMIT 1')
      })

      it('returns it', async () => {
        const result = await table.findOne()
        expect(result).toEqual(queryResult[0])
      })

      testFilters({
        method: 'findOne',
        queryStart: 'SELECT * FROM `test`',
        queryEnd: 'LIMIT 1'
      })
      
    })
    
  })

  describe('insert', () => {
    
    describe('table.insertOne(item)', () => {

      let id = 1
      let item = { codigo: 'JPG', nombre: 'Juan Pablo', apellido: 'Gonzales' }

      beforeEach(() => {
        fakeResultOnce({ insertId: id })
        fakeResultOnce([{ id, ...item }])
      })

      it('Describe the functionality', async () => {
        await table.insertOne(item)
        checkNthQuery(1, "INSERT INTO `test` (`codigo`, `nombre`, `apellido`) VALUES ('JPG', 'Juan Pablo', 'Gonzales')")
      })
      
      it('makes a select query for the inserted item', async () => {
        await table.insertOne(item)
        checkNthQuery(2, "SELECT * FROM `test` WHERE `id` = 1 LIMIT 1")
      })

      it('returns the inserted item', async () => {
        const result = await table.insertOne(item)
        expect(result).toEqual({ id, ...item })
      })
      
    })
  
    describe('table.insertMany(items)', () => {
      
      let items = [
        { codigo: 'A', nombre: 'aa' },
        { codigo: 'B', nombre: 'bb' },
        { codigo: 'C', nombre: 'cc' },
      ]
      
      beforeEach(() => {
        fakeResultOnce({})
        fakeResultOnce(items)
      })
      
      it('makes an insert query for an array of items', async () => {
        await table.insertMany(items)
        checkNthQuery(1, "INSERT INTO `test` (`codigo`, `nombre`) VALUES ('A', 'aa'), ('B', 'bb'), ('C', 'cc')")
      })

      it('selects the all rows >= than last_insert_id()', async () => {
        await table.insertMany(items)
        checkNthQuery(2, "SELECT * FROM `test` WHERE `id` >= last_insert_id()")
      })

      it('returns them', async () => {
        const result = await table.insertMany(items)
        expect(result).toEqual(items)
      })
      
    })

  })

  describe('update', () => {
  
    describe('table.updateOne(filters, update, options)', () => {
      
      let update = { codigo: 'A', nombre: 'B' }
      let item = { id: 1, codigo: 'A', nombre: 'B' }
      
      beforeEach(() => {
        fakeResult([item])
      })
      
      it('makes a update query', async () => {
        await table.updateOne({ id: item.id }, update)
        checkNthQuery(1, "UPDATE `test` SET `codigo` = 'A', `nombre` = 'B' WHERE `id` = 1 LIMIT 1")
      })

      it('selects first row that matches the filter', async () => {
        await table.updateOne({ id: item.id }, update)
        checkNthQuery(2, "SELECT * FROM `test` WHERE `id` = 1 LIMIT 1")
      })

      it('returns it', async () => {
        const result = await table.updateOne({ id: item.id }, update)
        expect(result).toEqual(item)
      })
      
      testFilters({
        method: 'updateOne',
        queryStart: "UPDATE `test` SET `codigo` = 'A', `nombre` = 'B'",
        queryEnd: 'LIMIT 1',
        args: [update],
      })
      
    })

    describe('table.updateMany(filters, update, options)', () => {
      
      let update = { nombre: 'dd' }
      let items = [
        { codigo: 'AA', nombre: 'aa' },
        { codigo: 'AB', nombre: 'ab' },
        { codigo: 'AC', nombre: 'ac' },
      ]
      
      beforeEach(() => {
        fakeResult(items)
      })
      
      it('makes a update query', async () => {
        await table.updateMany({ codigo: 'A' }, update)
        checkNthQuery(1, "UPDATE `test` SET `nombre` = 'dd' WHERE `codigo` LIKE '%A%'")
      })

      it('selects all rows that matche the filter', async () => {
        await table.updateMany({ codigo: 'A' }, update)
        checkNthQuery(2, "SELECT * FROM `test` WHERE `codigo` LIKE '%A%'")
      })

      it('returns them', async () => {
        const result = await table.updateMany({ codigo: 'A' }, update)
        expect(result).toEqual(items)
      })
      
      testFilters({
        method: 'updateMany',
        queryStart: "UPDATE `test` SET `nombre` = 'dd'",
        args: [update],
      })

    })
    
  })

  describe('remove', () => {
    
    describe('table.removeOne(filters, options)', () => {

      beforeEach(() => {
        fakeResult({ affectedRows: 1 })
      })
      
      it('removes all rows from the table', async () => {
        await table.removeOne()
        checkQuery('DELETE FROM `test` LIMIT 1')
      })

      it('returns the number of removed rows', async () => {
        const result = await table.removeOne()
        expect(result).toEqual({ removedCount: 1 })
      })

      testFilters({
        method: 'removeOne',
        queryStart: 'DELETE FROM `test`',
        queryEnd: 'LIMIT 1'
      })      
    
    })
  
    describe('table.removeMany(filters, options)', () => {
  
      beforeEach(() => {
        fakeResult({ affectedRows: 10 })
      })
      
      it('removes all rows from the table', async () => {
        await table.removeMany()
        checkQuery('DELETE FROM `test`')
      })

      it('Describe the functionality', async () => {
        const result = await table.removeMany()
        expect(result).toEqual({ removedCount: 10 })
      })

      testFilters({
        method: 'removeMany',
        queryStart: 'DELETE FROM `test`',
      })
      
    })
    
  })

  describe('utilities', () => {
    
    describe('table.count(filters)', () => {
      
      beforeEach(() => {
        fakeResultOnce([{ 'COUNT(*)': 1 }])
      })
      
      it('counts the rows from the table', async () => {
        await table.count()
        checkQuery('SELECT COUNT(*) FROM `test`')
      })
  
      it('returns the ["COUNT(*)"] propertie of the first result', async () => {
        const result = await table.count()
        expect(result).toEqual(1)
      })
  
      describe('when it recibes a filters object', () => {
        
        describe('an it has a property of type number', () => {
          
          it('searches exactly by that number', async () => {
            await table.count({ id: 10 })
            checkQuery('SELECT COUNT(*) FROM `test` WHERE `id` = 10')
          })
          
        })
  
        describe('an it has a property of type boolean', () => {
          
          it('searches exactly by that number', async () => {
            await table.count({ id: true })
            checkQuery('SELECT COUNT(*) FROM `test` WHERE `id` = true')
          })
          
        })
  
        describe('and it has a property of type string', () => {
          
          it('searches for rows like that string', async () => {
            await table.count({ codigo: 'ABC' })
            checkQuery("SELECT COUNT(*) FROM `test` WHERE `codigo` LIKE '%ABC%'")
          })
          
        })
        
        describe('and it has a property of type object', () => {
          
          describe('and the object has a property with name $exact', () => {
            
            it('searches exactly by its value', async () => {
              await table.count({ id: { $exact: 10 } })
              checkQuery('SELECT COUNT(*) FROM `test` WHERE `id` = 10')
            })
            
          })  
  
          describe('and the object has a property with name $like', () => {
            
            it('searches partially by its value', async () => {
              await table.count({ codigo: { $like: 'ABC' } })
              checkQuery("SELECT COUNT(*) FROM `test` WHERE `codigo` LIKE '%ABC%'")
            })
            
          })  
          
        })
        
      })
      
    })

    describe('table.columns({ ignore })', () => {
      
    })

    describe('table.exists(filters)', () => {
      
    })

    describe('table.pagination(filters, options)', () => {
      
    })
        
  })

  function testFilters({ method, queryStart, queryEnd, args = [] }) {
    
    describe('when it recibes a filters object', () => {
        
      describe('an it has a property of type number', () => {
        
        it('searches exactly by that number', async () => {
          await callMethod({ id: 10 })
          checkFilter('WHERE `id` = 10')
        })
        
      })

      describe('an it has a property of type boolean', () => {
        
        it('searches exactly by that number', async () => {
          await callMethod({ id: true })
          await callMethod({ id: false })
          checkFilter('WHERE `id` = true')
          checkFilter('WHERE `id` = false')
        })
        
      })

      describe('and it has a property of type string', () => {
        
        it('searches for rows like that string', async () => {
          await callMethod({ codigo: 'ABC' })
          checkFilter("WHERE `codigo` LIKE '%ABC%'")
        })
        
      })
      
      describe('and it has a property of type object', () => {
        
        describe('and it has a property with name $exact', () => {
          
          it('searches exactly by its value', async () => {
            await callMethod({ id: { $exact: 10 } })
            checkFilter('WHERE `id` = 10')
          })
          
        })  

        describe('and it has a property with name $like', () => {
          
          it('searches partially by its value', async () => {
            await callMethod({ codigo: { $like: 'ABC' } })
            checkFilter("WHERE `codigo` LIKE '%ABC%'")
          })
          
        })  

        describe('and it has a property with name $in', () => {

          describe('and $in is an array', () => {
            
            it('filters the columns in the value provinded', async () => {
              await callMethod({ codigo: { $in: ['a', 'b', 'c'] } })
              checkFilter("WHERE `codigo` IN ('a', 'b', 'c')")
            })
            
            describe('and $in.length == 0', () => {
              
              it('doesnt add the filter', async () => {
                await callMethod({ codigo: { $in: [] } })
                checkFilter()
              })

            })

          })

          describe('and $in is an object', () => {
            
            it('filters by the selected field in the object', async () => {
              await callMethod({ 
                id: { 
                  $in: [
                    { id: 'a', nombre: "AA" }, 
                    { id: 'b', nombre: "BB" }, 
                    { id: 'c', nombre: "CC" }, 
                  ] 
                } 
              })
              
              checkFilter("WHERE `id` IN ('a', 'b', 'c')")
            })
            
          })

          describe('and $in is null', () => {
            
            it('doesnt add the filter', async () => {
              await callMethod({ codigo: { $in: null } })
              checkFilter()
            })

          })
          
        })

        describe('and it has a property with name $not', () => {

          describe('and it has a property with name $exact', () => {
          
            it('filters the columns different to the value', async () => {
              await callMethod({ id: { $not: { $exact: 10 } } })
              checkFilter('WHERE `id` != 10')
            })
            
          })  
  
          describe('and it has a property with name $like', () => {
          
            it('filters the columns partly different to the value', async () => {
              await callMethod({ codigo: { $not: { $like: 'ABC' } } })
              checkFilter("WHERE `codigo` NOT LIKE '%ABC%'")
            })
            
          })  
  
          describe('and it has a property with name $in', () => {
  
            describe('and $in is an array', () => {
              
              it('filters the columns in the value provinded', async () => {
                await callMethod({ codigo: { $not: { $in: ['a', 'b', 'c'] } } })
                checkFilter("WHERE `codigo` NOT IN ('a', 'b', 'c')")
              })
              
              describe('and $in.length == 0', () => {
                
                it('doesnt add the filter', async () => {
                  await callMethod({ codigo: { $not: { $in: [] } } })
                  checkFilter()
                })
  
              })
  
            })
  
            describe('and $in is an object', () => {
              
              it('filters by the selected field in the object', async () => {
                await callMethod({ 
                  id: { 
                    $not: {
                      $in: [
                        { id: 'a', nombre: "AA" }, 
                        { id: 'b', nombre: "BB" }, 
                        { id: 'c', nombre: "CC" }, 
                      ] 
                    }
                  } 
                })
                
                checkFilter("WHERE `id` NOT IN ('a', 'b', 'c')")
              })
              
            })
  
            describe('and $in is null', () => {
              
              it('doesnt add the filter', async () => {
                await callMethod({ codigo: { $not: { $in: null } } })
                checkFilter()
              })
  
            })
            
          })
          
        })
        
      })
      
    })

    async function callMethod(filter) {
      return await table[method](filter, ...args)
    }

    function checkFilter(queryFilter) {
      let query = [queryStart, queryFilter, queryEnd].filter(query => !!query).join(' ')
      expect(database.query).toHaveBeenCalledWith(query)
    }

  }
  
})

function fakeResult(result) {
  database.query.mockResolvedValue(result)
  return result
}

function fakeResultOnce(result) {
  database.query.mockResolvedValueOnce(result)
  return result
}

function checkQuery(sql) {
  expect(database.query).toHaveBeenCalledWith(sql)
}

function checkNthQuery(nthCall, sql) {
  expect(database.query).toHaveBeenNthCalledWith(nthCall, sql)
}

function fakeDatabase() {
  return {
    query: jest.fn(),
    format,
    raw
  }
}