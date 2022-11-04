-- 1: Search for appropriate partner
local search_query = ARGV[1]
local search_result = redis.call("FT.SEARCH", "search_idx", search_query, "VERBATIM", "WITHSCORES", "LIMIT", 0, 1)

-- 2: If no partner found then return early and let server handle adding user to redis search index
if unpack(search_result) == 0 then
    return 0
end

-- 3: If partner found then remove existing user from redis search index
local hashkey = "search:user:" .. search_result[4][2]
redis.call("DEL", hashkey)
return search_result