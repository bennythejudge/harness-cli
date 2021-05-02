import { BaseCommand as Command } from '../../base-command'
import { flags } from '@oclif/command'
import { UsageScope, AppEnvScope, FilterType, EnvFilterType } from '../../providers/harness/types/scopes'
import { SecretType } from '../../providers/harness/secrets'
import { Harness } from '../../providers/harness/harness-api-client'

export default class SecretGetByName extends Command {
    static aliases = ['secret:getbyname', 'secrets:getbyname']
    static description = 'Get Secret Text By Name'

    static flags = {
        ...Command.flags,
        name: flags.string({ description: 'The name of the secret', required: true, char: 'n' }),
        secretManager: flags.string({ description: 'The id of the secret manager to leverage', required: true }),
        type: flags.enum({ options: [SecretType.Text], required: true, default: SecretType.Text }),
    }

    async run() {
        const { flags } = this.parse(SecretGetByName)

        const harness = await this.getHarnessClient()

        try {
            const secret = await harness.secrets.getByName(
              flags.name,
              flags.type,
            )
            this.log(secret)
        } catch (err) {
            const existsError = err.errors?.filter((e: { message: string | string[]; }) => e.message.includes('Duplicate name') || e.message.includes('secret exists')).length > 0
            if (existsError && flags.skipExisting) {
                this.debug('Resource already exists, but skipExisting is true.')
            } else {
                throw err
            }
        }
    }

    async parseUsageScope(scopes: string[], harness: Harness) {
        const usageScope: UsageScope = {
            appEnvScopes: [],
        }

        for (const scope of scopes) {
            const split = scope.split('::')
            if (split.length !== 2) {
                this.error(`Invalid format for scope '${scope}'`, { exit: 1 })
            }
            const app = split[0]
            const env = split[1]

            const appEnvScope: AppEnvScope = {
                application: {},
                environment: {},
            }

            if (app === 'ALL_APPS') {
                appEnvScope.application.filterType = FilterType.All
            } else {
                const application = await harness.applications.get(app)
                appEnvScope.application.appId = application.id
            }

            if (env === 'PROD_ENVS') {
                appEnvScope.environment.filterType = EnvFilterType.Prod
            } else if (env === 'NON_PROD_ENVS') {
                appEnvScope.environment.filterType = EnvFilterType.NonProd
            } else {
                const environment = await harness.environments.get(env, appEnvScope.application.appId)
                appEnvScope.environment.envId = environment.id
            }

            usageScope.appEnvScopes.push(appEnvScope)
        }

        return usageScope
    }
}
