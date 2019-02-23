const {ApiCaches} = require('../models');
const {GetDateDifference} = require('../helpers');

async function GetFromCache(name) {
    try {
        const cache = await ApiCaches.findOne({name: name});
        if (!cache) return null;
        if (!cache.data) return null;
        if (GetDateDifference(Date.now(), cache.updatedAt) >= cache.cacheTime && cache.cacheTime !== 0) {
            await ApiCaches.deleteOne({_id: cache._id});
            return null;
        }
        console.log(name, 'served from cache');
        return JSON.parse(cache.data);
    } catch (e) {
        console.log(e);
    }
}

async function SaveToCache(name, data, cacheTime = 168) {
    let cache = await ApiCaches.findOne({name: name});
    if (!cache) {
        cache = new ApiCaches();
        cache.name = name;
    }
    cache.data = JSON.stringify(data).replace(/^\s+|\s+$/g, '');
    cache.cacheTime = cacheTime;
    try {
        await cache.save();
        console.log(name, 'saved to cache');
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    GetFromCache,
    SaveToCache
};