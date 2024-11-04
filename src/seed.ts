import { AppDataSource } from "./config/database/data-source"
import { Book } from "./entities/book.entity"
import { Gender } from "./entities/gender.entity";
import { Subgender } from "./entities/subgender.entity";

const createBookGendersAndSubgenders = async () => {
    const gendersRepository = AppDataSource.getRepository(Gender);
    const subgendersRepository = AppDataSource.getRepository(Subgender);

    const actionGender = gendersRepository.create({ id: 1, name: "Ação" });
    const scientificGender = gendersRepository.create({ id: 2, name: "Científicos" });
    const economyGender = gendersRepository.create({ id: 3, name: "Economia" });
    const scienceFictionGender = gendersRepository.create({ id: 4, name: "Ficção Científica" });
    const religiousGender = gendersRepository.create({ id: 5, name: "Religiosos" });
    const romanceGender = gendersRepository.create({ id: 6, name: "Romance" });    

    await gendersRepository.save([
        actionGender,
        scientificGender,
        economyGender,
        scienceFictionGender,
        religiousGender,
        romanceGender
    ]);

    const actionSubgenders = subgendersRepository.create([
        { id: "2f60417f-dcd3-4e17-9865-b8217aad8f60", name: "Aventura", gender: actionGender },
        { id: "c6e1cfc0-3976-470f-ad57-cabcce75278f", name: "Espionagem", gender: actionGender },
        { id: "c411ea74-abc4-4460-aa4f-9062d03421f7", name: "Policial", gender: actionGender },
    ]);

    const scientificSubgenders = subgendersRepository.create([
        { id: "4e713d50-4ddb-4aeb-88af-57e99b47c4f7", name: "Astronomia", gender: scientificGender },
        { id: "ec3c0f95-7224-417a-b0bf-76bdc85f8961", name: "Biologia", gender: scientificGender },
        { id: "634a821e-3143-456d-a8cb-4453eef1a6b9", name: "Física", gender: scientificGender },
    ]);

    const economySubgenders = subgendersRepository.create([
        { id: "61933d12-a78b-40ac-af27-dfae707c930d", name: "Microeconomia", gender: economyGender },
        { id: "7881a972-8205-42ee-ad68-15f298478a96", name: "Macroeconomia", gender: economyGender },
        { id: "68e1aaa7-e10f-4f6d-a8e1-b6df33b6a794", name: "Economia Internacional", gender: economyGender },
    ]);

    const scienceFictionSubgenders = subgendersRepository.create([
        { id: "f1b2306a-2210-46b4-9d5b-c84b3d8377c4", name: "Cyberpunk", gender: scienceFictionGender },
        { id: "57466e8a-ba4f-4010-8d93-c1ed8461c358", name: "Distopia", gender: scienceFictionGender },
        { id: "4ef9281a-bc0b-49ed-ba44-568771d404a6", name: "Space Opera", gender: scienceFictionGender },
    ]);

    const religiousSubgenders = subgendersRepository.create([
        { id: "7a5f1af6-7c14-41b2-8d3d-a53169ac5fc4", name: "Cristianismo", gender: religiousGender },
        { id: "d8f714ba-c755-4746-9110-ee9ccf71f33a", name: "Espiritismo", gender: religiousGender },
        { id: "19e54d3e-7d17-44bf-a7f9-540409297970", name: "Islamismo", gender: religiousGender },
    ]);

    const romanceSubgenders = subgendersRepository.create([
        { id: "2f2d73c6-5994-4335-9ebe-619dec9047c4", name: "Contemporâneo", gender: romanceGender },
        { id: "7af6cee6-4969-4b88-ad1f-8fb16e82bb2d", name: "Histórico", gender: romanceGender },
        { id: "c6a185ee-a7a7-4cda-979a-28577108835b", name: "Policial", gender: romanceGender },
    ]);

    await subgendersRepository.save([
        ...actionSubgenders,
        ...scientificSubgenders,
        ...economySubgenders,
        ...scienceFictionSubgenders,
        ...religiousSubgenders,
        ...romanceSubgenders
    ]);
}

const createBooks = async () => {
    const booksRepository = AppDataSource.getRepository(Book);
    const subgendersRepository = AppDataSource.getRepository(Subgender);

    const spaceOperaSubgender = await subgendersRepository.findOneByOrFail({
        id: '4ef9281a-bc0b-49ed-ba44-568771d404a6',
    });

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
        description: `Em uma galáxia muito, muito distante, os fãs de Star Wars aguardavam por este momento inesquecível. No ano de encerramento da saga mais lendária da história do cinema, a DarkSide® Books apresenta uma nova edição de Star Wars: A Trilogia. Muito além de um fenômeno do cinema, Star Wars ditou regras na ficção científica, inspirou milhares de pessoas com a filosofia Jedi, nos levou até mundos incríveis e apresentou os personagens mais cativantes que poderiam existir no espaço.\nAs clássicas histórias de Luke Skywalker, Han Solo, Princesa Leia, Mestre Yoda e Darth Vader vão ganhar detalhes de outra galáxia em uma nova edição que todo geek terá orgulho de exibir em sua estante. A nova capa de Star Wars: A Trilogia tem detalhes em dourado, material semelhante a couro, Leia.\nNo ano em que a saga Star Wars chega ao fim com Star Wars Episódio IX: A Ascensão Skywalker, a DarkSide® Books apresenta uma nova edição que faz jus a importância da saga iniciada em 1977. Em Star Wars: A Trilogia, George Lucas escreve o Episódio IV – Uma Nova Esperança, com participação de Alan Dean Foster, a partir de uma adaptação do roteiro original do longa, e mostra, pela primeira vez, o jovem Luke Skywalker aos fãs, cinco meses antes do lançamento oficial do filme. O Episódio V – O Império Contra-Ataca, escrito por Donald F. Glut, é um dos mais adorados da saga e coloca Luke diante de lados opostos da Força. “Eu jamais poderia imaginar o nível dos laços emocionais que o público havia desenvolvido com Luke como um símbolo de bondade e Vader como a personificação do mal”, declarou George Lucas tempos depois.\nJá o Episódio VI – O Retorno de Jedi foi escrito por James Kahn – mesmo autor de Os Goonies, lançado pela DarkSide® Books. E preparar esse capítulo final da trilogia foi um grande desafio para George Lucas, já que o roteiro apresentava muitas histórias abertas e era preciso deixar tudo muito bem amarrado para os próximos filmes.\nA nova edição de Star Wars: A Trilogia, da DarkSide® Books, é também uma homenagem aos atores da saga que se foram recentemente, mas serão para sempre lembrados. Carrie Fisher (Princesa Leia) e Peter Mayhew (Chewbacca) se tornaram figuras fundamentais em Star Wars e conquistaram o coração dos fãs. Para os espectadores ainda mais saudosos, Fisher aparecerá em Star Wars – Episódio IX: A Ascensão Skywalker. Cenas gravadas para o Episódio VII (2015), e até então inéditas, serão aproveitadas no novo longa e prometem emocionar a todos.\nA DarkSide® Books também se preocupou em lançar a nova edição de Star Wars: A Trilogia no mês mais importante para a saga: maio. Somente um verdadeiro fã de Star Wars consegue entender essa importância. No dia 4 de maio é celebrado o #MayThe4thBeWithYou, uma espécie de feriado não-oficial com milhares de comemorações e reuniões dos fãs de Star Wars pelo mundo. Ainda neste mês, no dia 25 – conhecido como o Dia da Toalha –, foram lançados no cinema os Episódios IV e VI da saga; já o Episódio V ganhou as telonas no dia 21 de maio de 1980; George Lucas comemora seu aniversário no dia 14 e outro nome marcante também celebraria neste mês: Peter Mayhew, nascido no dia 19.\nOs fãs de Star Wars já podem comemorar em grande estilo, com uma edição épica que será admirada até mesmo das galáxias mais distantes do universo – uma verdadeira bíblia geek, o manual que todo e qualquer mochileiro Jedi precisa ter em sua coleção.`,
        subgender: spaceOperaSubgender,
    });

    await booksRepository.save(newBook);
}

const seed = async () => {
    await AppDataSource.initialize();
    await createBookGendersAndSubgenders();
    await createBooks();
    await AppDataSource.destroy();
}

seed();
