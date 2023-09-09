import { ClientEmbed } from '../../Structures';

const rulesEmbed = (): ClientEmbed => {
    return new ClientEmbed()
        .setColor(0xF1F1F1)
        .setFields(
            {
                name: '<:number_1:1134482652322340945> Mantenha o ambiente migável',
                value: '> Promova um ambiente amigável e acolhedor para todos os membros. Respeite as opiniões diferentes e evite conflitos desnecessários. Não serão tolerados ataques pessoais ou comportamentos hostis.'
            },
            {
                name: '<:number_2:1134482651395391589> Spam de SSNjis ou caps lock',
                value: '> Evite enviar mensagens inteiras em letras maiúsculas ou encher o chat com SSNjis. Não faça spam de mensagens repetitivas ou sem sentido.'
            },
            {
                name: '<:number_3:1134482654683742249> Use os canais adequados',
                value: '> Certifique-se de usar os canais corretos para cada tipo de discussão ou conteúdo. Evite enviar mensagens fora do contexto do canal.'
            },
            {
                name: '<:number_4:1134482659972751370> Respeito e civilidade',
                value: '> Trate todos os membros com respeito e cortesia. Evite linguagem ofensiva, discurso de ódio, bullying ou comportamento prejudicial.'
            },
            {
                name: '<:number_5:1134482657300971655> Proibido divulgações e/ou autopromoções',
                value: '> Não é permitido divulgar ou fazer autopromoção de outros servidores do Discord, links externos ou qualquer conteúdo não relacionado ao tema do servidor. Essa regra também inclui evitar a divulgação de produtos ou serviços com fins comerciais.'
            },
            {
                name: '<:number_6:1134482659209396224> Não perturbe excessivamente outros membros',
                value: '> Evite incomodar repetidamente outros membros com mensagens indesejadas ou comportamento excessivamente intrusivo.'
            },
            {
                name: '<:number_7:1134482658446037002> Respeite as decisões da moderação',
                value: '> Siga as orientações dos moderadores e administradores do servidor. Suas decisões são finais.'
            },
            {
                name: '<:number_8:1134482653396095018> Proibido apologia a grupos terroristas ou ideologias extremistas',
                value: '> Não são permitidas discussões, imagens, símbolos ou qualquer forma de apoio ou promoção de ideologias nazistas, grupos terroristas ou conteúdo extremista.'
            },
            {
                name: '<:number_9:1134482656583745606> Sem conteúdo NSFW (não apropriado para menores)',
                value: '> É estritamente proibido compartilhar ou discutir conteúdo adulto, explícito ou inadequado para menores.'
            },
            {
                name: '<:number_1:1134482652322340945><:number_0:1134482655442903170> Proibição de doxxing',
                value: '> Não é permitido divulgar informações pessoais de outros membros do servidor sem o consentimento explícito deles.'
            },
            {
                name: '<:number_1:1134482652322340945><:number_1:1134482652322340945> Proibição de participantes de servidores "panela" ou que cometem crimes virtuais',
                value: '> A participação em servidores conhecidos como "panela", que promovem atividades ilícitas, comportamentos criminosos ou prejudiciais a terceiros, bem como envolvimento em quaisquer atividades de crimes virtuais, é estritamente proibida.\n> Os usuários identificados como "paneleiros" ou envolvidos em crimes virtuais serão banidos permanentemente do servidor, sem aviso prévio.'
            });
};

const rulesEmbedFooter = (): ClientEmbed => {
    return new ClientEmbed()
        .setColor(0x5864f6)
        .setDescription('<:suporte_discord:1134481405141848194> Você também precisa seguir os [Termos de Serviço](https://discord.com/tos), as [Diretrizes da Comunidade](https://discord.com/guidelines) do Discord e as legislações do Brasil e do país no qual você reside.\n\n<:discord_heart:1134480925854547988> Assim também como todas as regras no seu perfil do Discord (avatar, banner, bio, etc) e nas Mensagens Diretas (MD\'s) dos membros.');
};


export {
    rulesEmbed,
    rulesEmbedFooter
};