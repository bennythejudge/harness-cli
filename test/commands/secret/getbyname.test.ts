import {expect, test} from '@oclif/test'

describe('secret:getbyname', () => {
  test
  .stdout()
  .command(['secret:getbyname'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['secret:getbyname', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
