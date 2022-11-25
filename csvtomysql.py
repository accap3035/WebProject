#!/usr/bin/env python3

with open("jobs.csv") as f:
  lines = f.readlines()  
counter = 0
for i in lines:
  columns = i
  print(columns)
  res = "("
  print(len(columns))
  if(counter==4):
    break
  else:
    counter+=1
  

      #db_Info = connection.get_server_info()
      #print("Connected to MySQL Server version ", db_Info)
      #cursor = connection.cursor()
      #cursor.execute("select database();")

