# StageBook

Recentemente, propus um desafio a mim mesma: tentar ir em shows de artistas ou bandas com todas as letras do alfabeto. O que é realmente um desafio, considerando que a maioria dos artistas que eu realmente gosto não está mais entre nós, e o meu favorito vivo está em hiatus. Ainda assim, é um desafio válido, porque gosto de diversas variações da arte brasileira, então ainda tenho muitas opções disponíveis.

O único problema era: eu estava anotando isso em um bloco de notas, o que não estava funcionando muito bem. Nem sempre eu tenho o computador na palma da mão e, além disso, eu registrava só o nome do artista, sem data ou qualquer outra informação do show. Por fim, sempre que eu queria rever as mídias do show ou até mesmo mostrar para alguém, era a mesma luta para achar na galeria, sem sequer lembrar o dia específico do show.

Curiosamente, eu tinha ido a um show dois dias antes dessa ponderada ser proposta, então era algo que estava fresco na minha mente e virou uma ideia: e se eu criasse um app no qual eu pudesse registrar todos os shows que eu já fui, guardando data, artista, local, companhias e até músicas apresentadas?

Me pareceu uma brilhante ideia, mas aí veio um pequeno problema: o escopo. Por mim, o app teria opção de ver os shows dos colegas, comentar, ver qual é o artista favorito de cada um, acessar o Spotify específico de cada artista, colocar TODAS as fotos dos shows e outras firulas nesse sentido. Mas, como o tempo não me permitia, precisei enxugar BASTANTE esse escopo.

Decidi focar em usuários isolados, visto que por agora não teremos interações entre eles. Então fechei o escopo nas seguintes funções: sistema de autenticação, adição de show, visualização da lista de shows, visualização dos detalhes de um show, integração com a Ticketmaster para consultar shows futuros vendidos pela empresa, notificações locais para lembrar de registrar as memórias e opção de fotografar ao vivo a capa do show em vez de só subir uma imagem depois.

Também fazem parte da minha intenção de implementação futura a opção de editar/excluir um show e uma tela de memórias, que mostraria todas as fotos do usuário sem dividir por show. Assim, daria para ter uma visão geral das lembranças e mostrar tudo para os amigos com mais facilidade do que navegar pelas datas na galeria.

## Tecnologias utilizadas

- React Native com Expo
- Expo Router
- TypeScript
- Supabase Auth
- Supabase Database
- Supabase Storage
- Ticketmaster API
- Expo Image Picker
- Expo Notifications
- Share API do React Native

## Funcionalidades implementadas

- Cadastro e login de usuários com Supabase.
- Logout.
- Listagem dos shows cadastrados pelo usuário.
- Cadastro de show com artista, data, local, companhias, depoimento, setlist e capa.
- Upload da capa do show para o Supabase Storage.
- Uso da câmera do celular para registrar a capa do show.
- Uso da galeria do dispositivo para escolher a capa do show.
- Visualização dos detalhes do show.
- Compartilhamento das informações de um show usando recurso nativo do sistema operacional.
- Consulta de próximos shows usando a Ticketmaster API.
- Busca de eventos por artista/evento e cidade.
- Notificações locais para lembrar de show próximo e de registrar memórias.

## Como rodar o projeto

Antes de começar, é necessário ter instalado:

- Node.js
- npm
- Expo Go no celular ou um emulador Android/iOS

Depois, instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a chave da Ticketmaster:

```bash
EXPO_PUBLIC_TICKETMASTER_API_KEY=sua_chave_da_ticketmaster
```

Para iniciar o projeto:

```bash
npx expo start
```

Depois disso, é só abrir o app pelo Expo Go usando o QR Code, ou rodar em um emulador.

Também existem os scripts:

```bash
npm run android
npm run ios
npm run web
```

## Observação sobre notificações

No Android, o Expo Go passou a ter limitações com `expo-notifications` a partir do SDK 53. Mesmo usando notificações locais, o Expo Go pode exibir um aviso relacionado a notificações remotas.

Para evitar esse problema durante os testes no Expo Go, o app detecta quando está rodando em Android + Expo Go e não agenda as notificações nesse ambiente. Em uma development build ou app nativo, o fluxo de notificações fica disponível normalmente.

## Processo de desenvolvimento

Iniciei o projeto com `npx create-expo-app@latest`, mas o meu aplicativo do Expo Go não era compatível com a versão inicial do projeto e também não permitia atualização. Isso me levou a voltar algumas versões no projeto em si para que ambos ficassem compatíveis.

Feito isso, comecei pelo sistema de autenticação, com login e cadastro. A principal dificuldade nessa parte foi lidar com o comportamento da tela quando o teclado abria. Como os campos ficam mais para o final da página, eles acabavam cobertos e eu queria que fosse possível rolar a tela até o botão de ação sem precisar fechar o teclado. Tentei ajustar isso mexendo no `ScrollView` e no comportamento do teclado, mas nada ficou exatamente como eu queria. Acabei deixando esse ponto em aberto por um momento, para adiantar as demais telas e depois voltar nele. Até o presente momento, ainda não consegui resolver esse problema.

Feita a parte de auth, fui para a parte dos shows propriamente dita: criação e visualização. Em primeiro lugar, fiz a lista dos shows e a opção de criação, ainda sem opção de ver detalhes, editar ou excluir, porque achei os dois primeiros pontos mais rápidos de fazer.

Depois, antes de prosseguir, decidi lidar com a parte das imagens, que é algo que eu nunca tinha trabalhado com muita propriedade: adicionar imagens no bucket do Supabase, salvar o link na linha do banco e por aí vai. Além desse desafio, encaixar a imagem como capa do show também era uma questão.

Na parte de conexão da imagem com o bucket, sofri menos do que imaginei. Os vídeos no YouTube foram suficientemente explicativos, rs. Só tive problema com uma policy que eu esqueci de adicionar e que estava dando erro para subir a imagem, mas depois disso deu tudo certo. Sobre encaixar a imagem como capa, consegui um jeito de deixar bonitinho também, nada que algumas buscas de inspiração na internet não ajudassem.

Olhando como o app estava naquele momento, decidi que ele tinha informação demais nos cards listados. Basicamente mostrava capa, data, artista, local, companhias e depoimento, ou seja, quase todas as informações, o que eliminaria a utilidade de uma tela de detalhes. Decidi, então, que o card inicial teria só artista, data e local, além da capa, que eu achei que deixou a estética bem legal. As demais informações ficariam em um popup de card detalhado, para deixar o app mais interativo e a visualização de cada show individualmente um pouco mais especial. Implementei o card de show e icou uma graça, deu um tchan.

Feito isso, decidi seguir para a parte de integração com API externa. Dado o contexto do app, achei interessante integrar com a API da Ticketmaster para poder ver shows que aconteceriam em datas próximas. Não é a solução maaaais legal do mundo, porque nem todos os shows são vendidos pela empresa, mas já é um bom começo e foi uma das opções dentro do contexto que considerei mais viáveis para implementação.

Na integração com a API, a documentação era bem boazinha até, então não foi um problema muuuito grande integrar. Tive dois problemas: primeiro, ela só buscava shows fora do Brasil. Quando ajustei para filtrar o país da request para cá, a maioria dos shows começou a aparecer como cidade não informada. Isso estava acontecendo porque cada hora eles enviavam a cidade em um lugar diferente da response, então tive que adaptar o service para buscar em diferentes partes. Funcionou! Nossa, que felicidade. Esse app está saindo e, não ironicamente, acho que vou usar muito.

PS: ainda brigo um pouco com a tipagem no TypeScript porque me acostumei com JavaScript, mas tenho me forçado a tipar mesmo quando "dá para continuar" sem, porque tenho entendido isso como boa prática, e acaba ficando de treino e aprendizado também.

Integrada a parte de shows futuros, decidi fazer a parte de compartilhamento dos shows do usuário. Coloquei essa funcionalidade no card de detalhes e decidi por algo simples: compartilhar os textos e o link da imagem, em vez da imagem propriamente dita. Achei essa opção mais viável, visto que levaria menos tempo, mas ainda assim traria uma funcionalidade bem interessante para o app. Futuramente quero colocar a parte de compartilhar com a imagem mesmo, até para poder enviar para os stories do Instagram, por exemplo. Por enquanto, esse é um dos primeiros tópicos da seção de passos futuros, rs.

Depois disso, fui para a parte de notificações e pensei em duas: uma no dia seguinte ao show, para lembrar de registrar no app, e uma na véspera, para dar uma inflada na empolgação. Tive um pequeno problema: o Expo Go do Android, mesmo com a implementação de notificações locais, emite um aviso/erro informando que o app não emite mais notificações remotas. Para evitar esse aviso, precisei tirar o import estático do `expo-notifications` e passei a carregá-lo dinamicamente só quando o ambiente suporta.

Por fim, implementei o uso da câmera para a capa do show. Como o app já tinha galeria funcionando, foi uma evolução bem natural: agora dá para tirar uma foto na hora ou escolher uma imagem já existente.

## Próximos passos

- Interação entre usuários.
- Edição e remoção de shows.
- Tela de memórias com todas as fotos cadastradas.
- Compartilhamento de memórias com imagem, não só texto/link.
- Melhorar o comportamento das telas quando o teclado abre.

## Considerações finais

O StageBook nasceu de uma necessidade bem pessoal, mas que eu acredito que pode ser útil para outras pessoas também. Muita gente guarda lembranças de shows espalhadas pela galeria, redes sociais, conversas e anotações soltas. A ideia do app é centralizar tudo isso em um lugar só, de um jeito simples, visual e gostosinho de usar.

Ainda tem muita coisa que eu quero melhorar, mas fiquei feliz com o caminho que o projeto tomou. Ele saiu de uma anotação meio bagunçada no bloco de notas para um app mobile funcional, com backend, banco, API externa, câmera, notificações e compartilhamento. Para uma primeira versão, achei bem digno.
