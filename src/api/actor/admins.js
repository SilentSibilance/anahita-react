import axios from 'axios';

const browse = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/admins.json`);
  };
};

const add = (namespaces) => {
  return (params) => {
    const { actor, admin } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, {
      action: 'addadmin',
      adminid: admin.id,
    });
  };
};

const deleteItem = (namespaces) => {
  return (params) => {
    const { admin, actor } = params;
    return axios.post(`/${namespaces}/${actor.id}.json`, {
      action: 'removeadmin',
      adminid: admin.id,
    });
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    add: add(namespace),
    deleteItem: deleteItem(namespace),
  };
};
