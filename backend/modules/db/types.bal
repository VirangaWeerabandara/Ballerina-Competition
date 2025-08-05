type User record {|
    string userId;
    string firstName;
    string lastName;
    string email;
    string password;
    string phoneNumber;
|};

type Project record {|
    string projectId;
    string userId;
    string title;
    string projectType;
    json blockLayout;
    boolean isShared;
|};

type Comment record {|
    string commentId;
    string userId;
    string projectId;
    string comment;
|};


type UserWithProjects record {|
    *User;
    Project[] projects?;
|};

type ProjectWithComments record {|
    *Project;
    Comment[] comments?;
|};

type UserWithComments record {|
    *User;
    Comment[] comments?;
|};
