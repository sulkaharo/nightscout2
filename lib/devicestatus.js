'use strict';

function storage (collection, ctx) {

    function create(obj, fn) {
        if (! obj.hasOwnProperty("created_at")){
            obj.created_at = (new Date()).toISOString();
        }
        api().insert(obj, function (err, doc) {
            fn(null, doc);
        });
    }

    function create_date_included(obj, fn) {
        api().insert(obj, function (err, doc) {
            fn(null, doc);
        });

    }

    function last(fn) {
        return api().find({}).sort({created_at: -1}).limit(1).toArray(function (err, entries) {
            if (entries && entries.length > 0)
                fn(err, entries[0]);
            else
                fn(err, null);
        });
    }

    function list(opts, fn) {
        var q = opts && opts.find ? opts.find : { };
        return ctx.store.limit.call(api().find(q).sort({created_at: -1}), opts).toArray(fn);
    }

    function api() {
        return ctx.store.pool.db.collection(collection);
    }


  api.list = list;
  api.create = create;
  api.last = last;
  api.indexedFields = indexedFields;
  return api;
}

var indexedFields = ['created_at'];

module.exports = storage;
