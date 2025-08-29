import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/turnos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteControlador::index
 * @see app/Http/Controllers/ClienteControlador.php:17
 * @route '/turnos'
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
const ClienteControlador = { index }

export default ClienteControlador