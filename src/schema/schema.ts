import graphql, {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql';
import mongoose from 'mongoose';

// const dummyData = [
//     {
//         id: 1,
//         name: "test",
//         description: "testing",
//         responses: "TEST"
//     },
//     {
//         id: 2,
//         name: "quote",
//         description: "quotes",
//         responses: "QUOTE"
//     }
// ];

const Command = mongoose.model('commands');

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
            async resolve(parentValue, args) {
                // return dummyData.filter((command) => command.name === args.name)[0];
                let commToFind = null;
                try {
                    commToFind = await Command.findOne({
                        name: args.name
                    });
                } catch(err) {
                    console.log("Command Query Error:", err);
                }
                return commToFind;
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCommand: {
            // "type" is the type of data resolve() will return
            type: CommandType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                responses: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parentValue, args) {
                try {
                    const updatedCommand = await Command.findOneAndUpdate({
                        name: args.name
                    }, {
                        name: args.name,
                        description: args.description,
                        responses: args.responses
                    }, {
                        upsert: true
                    });
                } catch(err) {
                    console.error("Command Mutation Error:", err);
                }
            } // end resolve()
        } // end addCommand
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation
});
