import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pacientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PacientesControlador::index
 * @see app/Http/Controllers/PacientesControlador.php:17
 * @route '/pacientes'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const PacientesControlador = { index }

export default PacientesControlador