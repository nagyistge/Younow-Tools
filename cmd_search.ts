import {settings} from "./main"

import {log,info,debug,error,getURL,prettify} from "./module_utils"
import {openDB,isUsernameInDB} from "./module_db"
import * as younow from "./module_younow"
import * as _async from "async"

export function cmdSearch(patterns:string[])
{
	openDB()
	.then(db=>
	{
		_async.eachSeries(patterns,
		function(user,callback)
		{
			user=younow.extractUser(user)

			let regex=new RegExp(user,"i")

			/** @todo */

			Object.keys(db).forEach(key=>
			{
				let dbuser:DBUser=db[key]

				if (dbuser.userId)
				{
					if (JSON.stringify(dbuser).match(regex))
					{
						let profile=dbuser.profile||"?"

						log(`${profile} (from db)`)
						log(prettify(dbuser))
					}
				}
			})

			callback()
		})
	})
	.catch(error)
}

export function cmdResolve(users:string[])
{
	openDB()
	.then(db=>
	{
		_async.eachSeries(users,
		function(user,callback)
		{
			user=younow.extractUser(user)
			younow.resolveUser(db,user)
			.then(infos=>
				{
					log(`${user} (online result)`)
					log(prettify(infos))
					callback()
				})
			.catch(err=>
			{
				error(err)
				callback()
			})
		})
	})
	.catch(error)
}
