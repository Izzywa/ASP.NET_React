git diff --stat --ignore-cr-at-eol . | awk 'BEGIN{init = 1; flag = 0} {print "test diff", $0,"\n"}' > test_diff.txt
git log --numstat --pretty=oneline -w --ignore-cr-at-eol --ignore-blank-lines  | awk 'BEGIN{init = 1; flag = 0} 
{if (init==0 && $1 ~ /^[0-9]+$/ && ($1>20 || $2>20)) 
    {print "too many insertions (",$1,") or deletions (",$2,") in file ", $3; flag=1}
}  
{if (length($1) == 40) 
    {init=0; if (flag==1) 
        {print "in commit",$0,"\n"; flag =0}
    }
}' > abnormal-log.txt