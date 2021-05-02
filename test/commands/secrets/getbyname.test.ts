import {expect, test} from '@oclif/test'

describe('secrets:getbyname', () => {
  test
  .stdout()
  .command(['secrets:getbyname'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['secrets:getbyname', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
