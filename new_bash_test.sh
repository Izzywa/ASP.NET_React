RED="\033[31m"
GREEN="\033[32m"
NC='\033[0m'

changes=($(git diff --stat --ignore-cr-at-eol .| awk '
{if ($1 ~ /^[0-9]/) 
    {print int($3);}
}
'))

git diff --numstat --ignore-cr-at-eol .| awk '
{if ($1 ~ /^[0-9]/) 
    {if ($1>20 || $2>20)
        {print "\033[31m" $0 "\033[0m"}
    else
        {print "\033[32m" $0 "\033[0m"}
    }
}
'