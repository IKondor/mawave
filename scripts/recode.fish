#!/usr/bin/fish

# set list (ls ./origin)

# for val in $list
#     convert "./origin/$val" "./png/$val.png"
# end

set list (ls ./png)

for val in $list
    convert "./png/$val" "./jpeg/$val.jpeg"
end
