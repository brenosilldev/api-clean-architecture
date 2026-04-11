// Interface que define o contrato para o serviço de configuração de ambiente.
//
// No Clean Architecture, interfaces são usadas para desacoplar a implementação concreta
// da camada que a consome. Isso significa que qualquer classe que implemente
// EnvConfigInterface pode ser usada no lugar de EnvConfigService — útil para testes
// ou para trocar a implementação sem mudar quem a usa.
export interface EnvConfigInterface {
    // Retorna a porta em que a aplicação deve escutar (ex: 3000).
    getAppPort(): number;

    // Retorna o ambiente de execução atual (ex: 'development', 'production', 'test').
    getNodeEnv(): string;
}
