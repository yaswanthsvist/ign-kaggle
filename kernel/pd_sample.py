import pytz
import matplotlib as plt
import pandas as pd
import json
import numpy as np
from datetime import datetime,date
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response

retail=pd.read_csv("ign.csv")
#def getdate(x):
#	return datetime.strptime("%s/%s/%s"%(x["release_year"],x["release_month"],x["release_day"]),"%Y/%m/%d");
release_date=retail.apply(lambda x:datetime.strptime("%s/%s/%s"%(x["release_year"],x["release_month"],x["release_day"]),"%Y/%m/%d"),axis=1)
#release_date=retail.apply(getdate,axis=1)
tz = pytz.timezone('America/Los_Angeles')
retail["release_date"]=["%d-%d-%d"%(d.year,d.month,d.day) for d in release_date]
retailSorted=retail.sort_values(["release_date"],ascending=True)
platforms=retailSorted["platform"]
geners=retailSorted["genre"]
data=retailSorted["score"]
#plt.scatter(retailSorted["release_date"],data)
uplatforms=platforms.unique()
ugeners=geners.unique()
final={
	"platforms":{},
	"genre":{},
	"begin":{},
	"end":{}
}
boolBgnPlatforms=platforms.duplicated()
boolEndPlatforms=platforms.duplicated("last")
beginPlatforms=retailSorted[~boolBgnPlatforms]
endPlatforms=retailSorted[~boolEndPlatforms]
final["begin"]={
	"platforms":{
		"platforms":beginPlatforms["platform"].tolist(),
		"year":beginPlatforms["release_year"].tolist()
	}
}
final["end"]={
	"platforms":{
		"platforms":endPlatforms["platform"].tolist(),
		"year":endPlatforms["release_year"].tolist()
	}
}
#print np.array(beginPlatforms.filter(["release_year","platform"]))
#print json.dumps(final["begin"])
def totalBinA(col_a,col_b,b_unique):
	out={}
	for b in b_unique:
		if(~pd.isnull(b)):
			out[b]=col_a[col_b==b].size
	return out

#print data[platforms=="iPad"]
for plat in uplatforms:
	platform=data[platforms==plat]
	#print "Games in ",plat," :",platform.size ," avg rview:",platform.mean()
	final["platforms"][plat]={
		"name":plat,
		"games":platform.size,
		"Avg Review":platform.mean(),
		"gener":totalBinA(platform,geners,ugeners)
	}
for gen in ugeners:
	gener=data[geners==gen]
	#print "Games in ",plat," :",platform.size ," avg rview:",platform.mean()
	final["genre"][gen]={
		"name":gen,
		"games":gener.size,
		"Avg Review":gener.mean(),
		"platform":totalBinA(gener,platforms,uplatforms)
	}
#print dumps(final)

def getMean(data,intervel):
	mean=[]
	for i in range(0,data.size/intervel):
		x=i*intervel
		if(x+intervel<=data.size):
			mean.append(pd.Series(data[x:x+intervel]).mean())
	return mean
#liste=pd.Series(getMean(data[100:200],10))
#print liste
#print data.size


@app.route('/platforms', methods = ['POST',"OPTIONS"])
def platforms():
    # Get the parsed contents of the form data
    json = request.json
    print(json)
    # Render template
    return jsonify(final["platforms"])

@app.route('/genres', methods = ['POST',"OPTIONS"])
def genres():
    # Get the parsed contents of the form data
    json = request.json
    print(json)
    # Render template
    return jsonify(final["genre"])

@app.route('/begin', methods = ['POST',"OPTIONS"])
def begin():
    return json.dumps(final["begin"])
@app.route('/end', methods = ['POST',"OPTIONS"])
def end():
    return json.dumps(final["end"])
@app.route('/releases', methods = ["OPTIONS"])
def releaseso():
	return json.dumps({})
@app.route('/releases', methods = ['POST'])
def releases():
	#uyears=retailSorted["release_year"]
	data=request.json
	typ=data["type"]
	print data
	print typ
	x=np.array([index for index,val in retailSorted.groupby(typ).size().iteritems()]).tolist()
	y=np.array([val for index,val in retailSorted.groupby(typ).size().iteritems()]).tolist()
	return json.dumps({"x":x,"y":y})

# Run
if __name__ == '__main__':
    app.run(
        host = "0.0.0.0",
        port = 8099
    )


