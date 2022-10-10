const graphql = require('graphql')
const { GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLList } = require("graphql")



const Edge = (itemType) => {
    return new GraphQLObjectType({
        name: "EdgeType",
        fields: () => ({
            node: { type: itemType },
            cursor: { type: GraphQLString }
        })
    })
}

const PageInfo = new GraphQLObjectType({
    name: "PageInfoType",
    fields: () => ({
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString },
        hasNextPage: { type: GraphQLString },
    })
})

const Page = (itemType) => {
    return new GraphQLObjectType({
        name: "PageType",
        fields: () => ({
            totalCount: { type: GraphQLInt },
            edges: { type: new GraphQLList(Edge(itemType)) },
            pageInfo: { type: PageInfo }
        })
    })
}

const convertNodeIdToCursor = (node) => {
    return new Buffer.from(node.id, 'binary').toString('base64')
}

const convertCursorToNodeId = (cursor) => {
    return new Buffer.from(cursor, 'base64').toString('binary')
}
module.exports = {
    Page,
    convertNodeToCursor,
    convertCursorToNodeId
}