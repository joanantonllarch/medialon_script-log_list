// 1. Script Begins
({
    //*************************************************************************
    // 2 - INFO
    //*************************************************************************
    Info:
    {   Title:"Logging in a list v1.0",
        Author:"Joan A. Llarch - Barcelona - 2020",
        Version:"1.0",
        Description:"Logging a string in a list prefixing it with a timestamp. Old lines exceeding the maximum are removed",

        Setup:
        { list_max_len:
          {   Widget:"LineEdit",
              MaxLength:5,
              Width:100,
              Name:"Max Log Lines"
          },
        },  
        Commands: 
        { add_string: 
          {   Name: "Log a String",
              GroupName: "Setup",
              GroupOrder: "1",
              GroupCmdOrder: "1",
              Params: {
                  list_name: {
                      Name: "List Name",
                      Wizard: "ListNameSelector",
                  },
                  data_string: {
                      Name: "String",
                      Type: "String",
                      Widget:"LineEdit",
                      MaxLength:64,
                      Width:200,
                  },
              },
          },
      },   
    },
    //*************************************************************************
    //  3 - SETUP VARIABLES
    //*************************************************************************
    Setup:
    {   list_max_len: "100",  // including the txt info
    },
    //*************************************************************************
    //  4 - DEVICE VARIABLES
    //*************************************************************************

    //*************************************************************************
    //  4b - LOCAL VARIABLES
    //*************************************************************************

    //*************************************************************************
    //  5 - PUBLIC FUNCTIONS
    //*************************************************************************
    add_string: function( data_string, list_name )
    { // info
      var txt = "oldest data has been removed";
      if ( data_string != ''){
        var list_in_text = QMedialon.GetValueAsString(list_name + ".Text");
        // list to array
        var split_list = [];
        split_list = list_in_text.split('\r\n');
        // delete last item because is always empty
        split_list.splice(split_list.length-1, 1);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // get timestamp from manager or showmaster
        var t = QMedialon.GetValueAsString( "Showmaster.CurrentTime" );
        if ( t == "")
          t = QMedialon.GetValueAsString( "Manager.CurrentTime" );
        var d =QMedialon.GetValueAsString( "Showmaster.CurrentDate" );
        if ( d == "")
          d = QMedialon.GetValueAsString( "Manager.CurrentDate" );
        var time = '(' + d + ' ' + t + ') ';
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        split_list.push( time + data_string );
        //
        var len = split_list.length;
        if ( len > this.Setup.list_max_len )
        {	split_list.shift();
          split_list.shift();
          split_list.unshift(txt);
          len--;
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var result = split_list.join("\r\n");
        result += "\r\n";
        QMedialon.SetValue(list_name + ".Text", result);
        // show last list item as selected
        QMedialon.SetValue(list_name + ".Status", len-1);
        return "";
      }
    },
    //*************************************************************************
    //  5b - PRIVATE FUNCTIONS
    //*************************************************************************

// 6. Script Ends
}) 