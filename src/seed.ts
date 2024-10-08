import { AppDataSource } from "./config/database/data-source"
import { Book } from "./entities/book.entity"

const createBooks = async () => {
    await AppDataSource.initialize();
    const booksRepository = AppDataSource.getRepository(Book);

    const newBook = booksRepository.create({
        id: 'fd1b0dbf-ec39-4939-b32a-86b55c53d9d5',
        image_1: 'livrostar.jpg',
        image_2: 'livrostarwars.png',
        book_file: 'book.pdf',
        book_name: "Star Wars A Trilogia",
        author: "George Lucas",
        publisher: "Darkside",
        language: "Português",
        pages: 528,
        gender: "Ficção Científica",
        description: `Em uma galáxia muito, muito distante, os fãs de Star Wars aguardavam por este momento inesquecível. No ano de encerramento da saga mais lendária da história do cinema, a DarkSide® Books apresenta uma nova edição de Star Wars: A Trilogia. Muito além de um fenômeno do cinema, Star Wars ditou regras na ficção científica, inspirou milhares de pessoas com a filosofia Jedi, nos levou até mundos incríveis e apresentou os personagens mais cativantes que poderiam existir no espaço.\nAs clássicas histórias de Luke Skywalker, Han Solo, Princesa Leia, Mestre Yoda e Darth Vader vão ganhar detalhes de outra galáxia em uma nova edição que todo geek terá orgulho de exibir em sua estante. A nova capa de Star Wars: A Trilogia tem detalhes em dourado, material semelhante a couro, Leia.\nNo ano em que a saga Star Wars chega ao fim com Star Wars Episódio IX: A Ascensão Skywalker, a DarkSide® Books apresenta uma nova edição que faz jus a importância da saga iniciada em 1977. Em Star Wars: A Trilogia, George Lucas escreve o Episódio IV – Uma Nova Esperança, com participação de Alan Dean Foster, a partir de uma adaptação do roteiro original do longa, e mostra, pela primeira vez, o jovem Luke Skywalker aos fãs, cinco meses antes do lançamento oficial do filme. O Episódio V – O Império Contra-Ataca, escrito por Donald F. Glut, é um dos mais adorados da saga e coloca Luke diante de lados opostos da Força. “Eu jamais poderia imaginar o nível dos laços emocionais que o público havia desenvolvido com Luke como um símbolo de bondade e Vader como a personificação do mal”, declarou George Lucas tempos depois.\nJá o Episódio VI – O Retorno de Jedi foi escrito por James Kahn – mesmo autor de Os Goonies, lançado pela DarkSide® Books. E preparar esse capítulo final da trilogia foi um grande desafio para George Lucas, já que o roteiro apresentava muitas histórias abertas e era preciso deixar tudo muito bem amarrado para os próximos filmes.\nA nova edição de Star Wars: A Trilogia, da DarkSide® Books, é também uma homenagem aos atores da saga que se foram recentemente, mas serão para sempre lembrados. Carrie Fisher (Princesa Leia) e Peter Mayhew (Chewbacca) se tornaram figuras fundamentais em Star Wars e conquistaram o coração dos fãs. Para os espectadores ainda mais saudosos, Fisher aparecerá em Star Wars – Episódio IX: A Ascensão Skywalker. Cenas gravadas para o Episódio VII (2015), e até então inéditas, serão aproveitadas no novo longa e prometem emocionar a todos.\nA DarkSide® Books também se preocupou em lançar a nova edição de Star Wars: A Trilogia no mês mais importante para a saga: maio. Somente um verdadeiro fã de Star Wars consegue entender essa importância. No dia 4 de maio é celebrado o #MayThe4thBeWithYou, uma espécie de feriado não-oficial com milhares de comemorações e reuniões dos fãs de Star Wars pelo mundo. Ainda neste mês, no dia 25 – conhecido como o Dia da Toalha –, foram lançados no cinema os Episódios IV e VI da saga; já o Episódio V ganhou as telonas no dia 21 de maio de 1980; George Lucas comemora seu aniversário no dia 14 e outro nome marcante também celebraria neste mês: Peter Mayhew, nascido no dia 19.\nOs fãs de Star Wars já podem comemorar em grande estilo, com uma edição épica que será admirada até mesmo das galáxias mais distantes do universo – uma verdadeira bíblia geek, o manual que todo e qualquer mochileiro Jedi precisa ter em sua coleção.`,
    });

    await booksRepository.save(newBook);
    await AppDataSource.destroy();
}

createBooks();