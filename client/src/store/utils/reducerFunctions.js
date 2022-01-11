export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      convo.latestMessageText = message.text;
      return {
        ...convo,
        messages: [
          ...convo.messages,
          message
        ]
      };
    } else {
      return convo;
    }
  });
};

export const updateMessagesInStore = (state, payload) => {
  const { messages } = payload;

  if (messages && messages.length > 0) {
    return state.map((convo) => {
      if (convo.id === messages[0].conversationId && JSON.stringify(messages).localeCompare(JSON.stringify(convo.messages)) !== 0) {
        convo.latestMessageText = messages.slice(-1)[0].text;
        return {
          ...convo,
          messages: [
            ...messages
          ]
        };
      }
      else {
        return convo;
      }
    });
  }

  return state;
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      convo.id = message.conversationId;
      convo.latestMessageText = message.text;

      return {
        ...convo,
        messages: [
          ...convo.messages,
          message
        ]
      };
    } else {
      return convo;
    }
  });
};
