import graphql, {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema
} from 'graphql';

const dummyData = [
    {
        id: 1,
        name: "test",
        description: "testing",
        responses: "TEST"
    },
    {
        id: 2,
        name: "quote",
        description: "quotes",
        responses: "QUOTE"
    }
];

// TODO: Refactor "responses" to be an array/list type
const CommandType = new GraphQLObjectType({
    name: 'Command',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        responses: { type: GraphQLString }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        command: {
            type: CommandType,
            args: { name: { type: GraphQLString } },
            resolve(parentValue, args) {
                return dummyData.filter((command) => command.name === args.name)[0];
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery
});
