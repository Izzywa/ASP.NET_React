RED="\033[31m"
GREEN="\033[32m"
NC='\033[0m'

addition=($(git diff --numstat --ignore-cr-at-eol .| awk '
    {print int($1)}
'))

deletion=($(git diff --numstat --ignore-cr-at-eol .| awk ' 
    {print int($2)}
'))

# WILL NOT SHOW CHANGES OF NEWLY CREATED FILE THAT WAS NEVER TRACKED BEFORE
git diff --numstat --ignore-cr-at-eol .| awk '
{if ($1 ~ /^[0-9]/) 
    {if ($1>20 || $2>20)
        {print "\033[31m" $0 "\033[0m"}
    else
        {print "\033[32m" $0 "\033[0m"}
    }
}
'

max_addition=0
max_deletion=0

for index in "${!addition[@]}"
do

    if [ ${addition[$index]} -ge $max_addition ]; then
        max_addition="${addition[$index]}"
    fi

    if [ ${deletion[$index]} -ge $max_deletion ]; then
        max_deletion="${deletion[$index]}"
    fi

done

if [ $max_addition -ge 20 ] || [ $max_deletion -ge 20 ]; then
    echo "\n${RED}Too many addition ($max_addition) or deletion ($max_deletion) \nThis will reslult in reduced marks${NC}"

else 
    if [ $max_addition -ge 15 ] || [ $max_deletion -ge 15 ]; then
        read -p "Enter commit message or press ENTER to abort commit: " message
        if [ -z "${message}" ]; then
            echo "${GREEN}ABORT COMMIT${NC}"
        
        else
            git add .
            git commit -m "$message"
        fi
    fi

    #Insert test commands here
    echo "RUN TEST HERE"
fi