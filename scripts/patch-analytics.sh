in_dir(){
    for entry in $1/*".php"
    do
      "../scripts/gtm-patcher.py" "$entry"
    done
    for entry in $1/*".html"
    do
      "../scripts/gtm-patcher.py" "$entry"
    done
    for entry in $1/*
    do
      if [ -d "${entry}" ] ; then
        in_dir $entry
      fi
    done
}
in_dir "."
