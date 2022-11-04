-- 1: Pop last random partner off list
local rpop_result = redis.call("RPOP", "random:user")

-- 2: If no user is returned then push user to start of queue
if rpop_result == false then
    local user_id = ARGV[1]
    local lpush_result = redis.call("LPUSH", "random:user", user_id)
    if lpush_result > 0 then
        return 0 -- success
    else
        return 1 -- failure
    end
end

-- 3: Otherwise return random partner
return rpop_result