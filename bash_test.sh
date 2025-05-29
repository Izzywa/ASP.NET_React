RED="\033[31m"
GREEN="\033[32m"
NC='\033[0m'

changes=($(git diff --stat --ignore-cr-at-eol .| awk '
{if ($1 !~ /^[0-9]/) 
    {print int($3);}
}
'))

git diff --stat --ignore-cr-at-eol .| awk '
{if ($1 !~ /^[0-9]/) 
    {if ($3>20)
        {print "\033[31m" $0 "\033[0m"}
    else
        {print "\033[32m" $0 "\033[0m"}
    }
}
'

#test line 2
echo ""

max=0

for i in "${changes[@]}"
do 
    if [ $i -ge $max ]; then
        max="$i"
    fi

done

if [ $max -ge 20 ]; then
    echo "${RED}TOO MANY CHANGES \nTHIS WILL RESULT IN REDUCED MARKS${NC}"

else 
    if [ $max -ge 10 ]; then
        read -p "Enter commit message or press ENTER to abort commit: " message
        if [ -z "${message}" ]; then
            echo "${GREEN}ABORT COMMIT${NC}"
        
        else
            git add .
            git commit -m "$message"
        fi
    fi

    #test here
    #test here
    #test here
    echo "RUN TESTS HERE"

fi
