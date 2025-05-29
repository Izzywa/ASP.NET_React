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

# git log --numstat --pretty=oneline -w --ignore-cr-at-eol --ignore-blank-lines | tac | awk 'BEGIN{init = 1; flag = 0} {if (init==0 && $1 ~ /^[0-9]+$/ && ($1>20 || $2>20)) {print "too many insertions (",$1,") or deletions (",$2,") in file ", $3; flag=1}}  {if (length($1) == 40) {init=0; if (flag==1) {print "in commit",$0,"\n"; flag =0}}}' > artifacts/abnormal-log.txt
        
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
    if [ $max -ge 15 ]; then
        read -p "Enter commit message or press ENTER to abort commit: " message
        if [ -z "${message}" ]; then
            echo "${GREEN}ABORT COMMIT${NC}"
        
        else
            git add .
            git commit -m "$message"
        fi
    fi

    echo "RUN TESTS HERE"

fi
