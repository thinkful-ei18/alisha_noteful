/* global $ */
'use strict';

const api = {
  
  search: function (query) {
    return $.ajax({
      type: 'GET',
      url: '/v1/notes/',
      dataType: 'json',
      data: query
    });
  },
  
  details: function (id) {
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/v1/notes/${id}`
    });
  },
  
  update: function (id, obj) {
    return $.ajax({
      type: 'PUT',
      url: `/v1/notes/${id}`,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(obj),
      
    });
  },

  create: function (obj) {
    return $.ajax({
      url: '/v1/notes',
      method: 'POST',
      data: JSON.stringify(obj),
      dataType: 'json',
      contentType: 'application/json',
      // error: error => console.log(error)
    });
  },

  delete: function (id) {
    return $.ajax({
      url: `/v1/notes/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      // error: error => console.log(error)
    });
  }

}; 