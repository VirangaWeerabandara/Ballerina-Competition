enum ProjectType {
    RESTApi,
    GraphQL,
    WebSocket
}

type Project record {
string projectId;
string userId;
string title;
ProjectType projectType;
boolean isShared;
json blockLayout;
};