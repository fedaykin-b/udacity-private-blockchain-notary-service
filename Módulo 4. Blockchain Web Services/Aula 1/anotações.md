# Lição 4 - Blockchain Web Services

## Aula 1

1. Boa parte do assunto é sobre planejamento.

2. Tópicos:
    1. Analisar os casos de uso que determinem o serviço Web de um blockchain.
    2. Decidir por uma linguagem de serviço Web.
    3. Explicar o framework Node.js e componentes úteis ao blockchain.

3. O que é um serviço Web?
    > + uma função que pode ser acessada por outros programas pela internet.
    > + Web service é um componente de software acessível por meio de protocolos padrões de web (e.g. HTTP/HTTPS) e projetado para interação com outros programas, ao invés de usuários.

4. Website # Web service.
    > Websites permitem a colaboração entre pessoas . Web services possibilitam a interação entre programas.

5. formatos comuns para disponibilizar dados são XML e JSON, porque permitem grande interoperabilidade entre programas.

6. SOAP é um protocolo comum utilizado em projetos. Ele especifica como codificar cabeçalhos HTTP e arquivos XML.

7. UDDI é um padrão de Web services orientado a empresas, que estrutura os dados em um padrão XML conhecido como WSDL.

8. Outro protocolo comum é o REST, que é um guia de estrutura de protocolos que usa requisições HTTP GET, PUT, POST e DELETE.

9. Quando integrar blockchain com Web Service?
    1. Quando os usuários precisam de uma GUI para interagir com a aplicação, é melhor disponibizá-la pela internet.
    2. Quando cada cliente deveria ter sua própria instância de app.
    3. Intenção de não possuir um servidor central (?)

10. Quando não integrar?
    1. quando a tarefa pode ser feita diretamente, sem necessidade de API.
    2. dispositivos móveis podem se comunicar diretamente com o blockchain.

11. Aspectos a considerar ao optar por um blockchain:
    >  These questions were originally put together by [Viant](https://viant.io/)
    1. Problem of Value Identification
        1. Is there a need to share information, credentials or value with others?
        2. Is trust a critical requirement to the process?
        3. Do you need to prove to others you are transacting/reporting accurately?
        4. Is there potential to monetize the data or digital asset in the value chain?
        5. Who owns the problem? Individual or industry wide challenges?
    2. Stakeholders buy in
        1. 1Is there a network of stakeholders (i.e. more than 2)?
        2. Is there a dependency on others for information?
        3. Does more than one participant need to update the data?
        4. Is there scope to open up the ecosystem to ancillary parties in the future?
        5. Are you working with other industry players on any activities?
    3. Technical considerations
        1. Is there any ongoing need or future requirements for high data throughput?
        2. Do you rely or use public data sources to make decisions?
        3. Do you need to store a particularly rich/complex data structure?
        4. Do you need to digitize assets in your value chain?
        5. Do you need transaction privacy? Do you need anonymity?

12. Plano para construir um serviço Web a partir de um blockchain privado:
    1. configurar a API do serviço web com GET/POST para interagir com dados estáticos de teste.
    2. configurar os pontos de acesso da API para interagir com os métodos do blockchain privado.
        1. GET - getBlock pelo ID
        2. POST - novo bloco
    3. criar um método para avaliar a integridade do blockchain

13. Critérios para decidir uma linguagem de programação para um serviço Web:
    1. O foco é front-end, back-end, ou ambos?
    2. O quanto a linguagem é atualizada?
    3. Como essa linguagem interage com outros sistemas?
    4. Como é o desempenho?

14. Node é single-threaded, non-blocking e assíncrono. É baseado no Google V8 e é eficiente em uso de memória. E utilizado por grandes empresas e tem um grande ecossistema de bibliotecas.

15. repositório para exercício: <https://github.com/udacity/nd1309_exercise_client_server>