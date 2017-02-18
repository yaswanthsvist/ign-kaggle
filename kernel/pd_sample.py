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
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

retail=pd.read_csv("ign.csv")
retail=retail[~retail["genre"].isnull()]
#retailSer=np.isnan(np.array(retail["genre"][1]))

#platform=retail["genre"].unique()
#print retailSer
#def getdate(x):
#	return datetime.strptime("%s/%s/%s"%(x["release_year"],x["release_month"],x["release_day"]),"%Y/%m/%d");
release_date=retail.apply(lambda x:datetime.strptime("%s/%s/%s"%(x["release_year"],x["release_month"],x["release_day"]),"%Y/%m/%d"),axis=1)
#release_date=retail.apply(getdate,axis=1)
#tz = pytz.timezone('America/Los_Angeles')
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

beginEndPlat=beginPlatforms["platform"].tolist()
[beginEndPlat.append(x) for x in endPlatforms["platform"].tolist()]

beginEndZ=[0.5 for x in beginPlatforms["platform"]]
[beginEndZ.append(1) for x in endPlatforms["platform"]]

beginEndYear=beginPlatforms["release_year"].tolist()
[beginEndYear.append(x) for x in endPlatforms["release_year"].tolist()]

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
final["beginEnd"]={
	"platforms":{
		"platforms":beginEndPlat,
		"year":beginEndYear,
		"z":beginEndZ
	}
}
#print np.array(beginPlatforms.filter(["release_year","platform"]))
#print json.dumps(final["begin"])
def totalBinA(col_a,col_b,b_unique):
	out={}
	for b in b_unique:
		if(~pd.isnull(b)):
			if(col_a[col_b==b].size!=0):
				out[b]=col_a[col_b==b].size
	return out
def getColPerGamesWithLimit(col="platform",increasing=False,limit=10):
	data= pd.DataFrame(data=[[un,retail[retail[col]==un][col].size] for un in retail[col].unique()],columns=[col,"games"]).sort_values(["games"],ascending=increasing)[:limit]
	return {"x":data["games"].tolist(),"y":data[col].tolist()}
#print data[platforms=="iPad"]
for plat in uplatforms:
	platform=data[platforms==plat]
	final["platforms"][plat]={
		"name":plat,
		"games":platform.size,
		"avgReview":platform.mean(),
		"gener":totalBinA(platform,geners,ugeners)
	}
for gen in ugeners:
	gener=data[geners==gen]
	final["genre"][gen]={
		"name":gen,
		"games":gener.size,
		"avgReview":gener.mean(),
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
@app.route('/platforms', methods = ["OPTIONS"])
def platforms_o():
    return json.dumps({})
@app.route('/platforms', methods = ['POST'])
def platforms():
    return json.dumps(final["platforms"])

@app.route('/genres', methods = ['POST',"OPTIONS"])
def genres():
    return jsonify(final["genre"])

@app.route('/begin', methods = ['POST',"OPTIONS"])
def begin():
    return json.dumps(final["begin"])
@app.route('/end', methods = ['POST',"OPTIONS"])
def end():
    return json.dumps(final["end"])
@app.route('/beginEnd', methods = ['POST',"OPTIONS"])
def beginEnd():
    return json.dumps(final["beginEnd"])
@app.route('/releases', methods = ["OPTIONS"])
def releases_o():
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
@app.route('/v1/services/<api>', methods = ['POST'])
def service(api):
	func=globals()[api]
	data = {}
	try:
		data = request.get_json(force=True)
		if not data.has_key("auth_token") :
			data =  data["data"] if data.has_key("data") else {}                     
		print(str(data))
	except Exception as e:
		print(e)
	for key, value in request.args.iteritems():                
		try:
			if int(value) == float(value):
				data[key]=int(value)                
			else:
				data[key]=float(value)            
		except:
			try:
				data[key]=float(value)                
			except:
				data[key]=value
	try:
		print data
		result = func(**data)
		if result is None:
			result = "Success"
		print("Data To Return :" + str(result))
		print 'func-' + str(func.__name__)
		resStr = { "data" : result }
		return jsonify(resStr)
	except:
		return jsonify({})


# Run
if __name__ == '__main__':
    app.run(
        host = "0.0.0.0",
        port = 8099
    )


