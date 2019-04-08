# Lição 4 - Blockchain Web Services

## Aula 5

1. Blockchain pode ser utilizado para garantir a prova de posse de um ativo digital.

2. > ativo digital: conteúdo armazenado digitalmente, bem como contas que permitam tal acesso.

3. Blockchains não são adequados para armazenar os arquivos. A função mais útil é usá-los para identificar a posse, uso e existência de ativos digitais.

4. Codificação e decodificação: processo de produzir e interpretar informação.

5. > encoding: processo de sequenciar caracteres em um formato especializado em eficiência de transmissão e armazenamento.

6. > decoding: converte arquivos codificados de volta para formato legível.

7. Formas comuns de encoding:
    1. ASCII - a table representing chars as numbers.
    2. Hexadecimal - representação de binário mais concisa e "legível" para humanos.
    3. Base64 - um meio de representar números como um string, através de uma tabela.
    4. Base58 - uma redução sobre o Base64, removendo caracteres ambíguos, como a letra maiúscula "O" e zero 0.

8. comando para codificar strings e dados binários em hexadecimal:

```xxd -p <<< string``` or ```xxd -p file new_file```

Para decodificar use:

```echo string|xxd -p - r``` or ```xxd -p -r encoded_file decoded_file```

9. Prova de existência (Proof of Existence - POE): pode-se calcular o hash de um arquivo e publicá-lo em um blockchain, a fim de provar de que tal documento existia em certa data. Isso equivale ao serviço de um cartório tradicional que registra um documento, a fim de provar sua existência.

10. POE geralmente utiliza SHA256 ou MD5.

11. Assegurar um ativo é protegê-lo contra alterações por acidente ou fraudulentas.

12. Sobre blockchains, o bitcoin é denominado como de 1ª geração, e o Ethereum de 2ª direção. Isso porque o Ethereum adicionou a opção de criar contratos inteligentes.
    1. Blockchains de 1ª geração focam em transferências de ativos, funcionando de forma similar a uma moeda.
    2. Blockchains de 2ª geração focam em transações, e disponibilizam estruturas de código que podem processar as transações, denominadas como 'smart contracts'.
    3. ambos mantêm a dependência da estrutura de dados em forma de blocos, com transações publicamente acessíveis e carteiras representando usuários no sistema.


