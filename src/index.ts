/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	 KV: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		//to  allow brouser fetch this API
		//must be changed on production
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
			"Access-Control-Max-Age": "86400",
		  }; 

		const { pathname } = new URL(request.url)
		
		//TODO add error handlers 

		//code for getting one product by provided key
		if (pathname.startsWith("/get")) {
			const urlparameters = new URLSearchParams(request.url);
			
			const name =  urlparameters.get("key");
			const productfromKV = await env.KV.get(name)
		
			return new Response(productfromKV, { headers: {
			  ...corsHeaders
			} });
		  }

		//code for getting the list of all product 
		if (pathname.startsWith("/all")) {
			const productslist = await env.KV.list()
			const productskeys = productslist.keys
				//TODO: make a list using keys of all produst for Angular app
			console.log(productskeys)
			return new Response(JSON.stringify(productskeys), { headers: {
				...corsHeaders
			  } });
		}


		//code for adding product to KV database
		if (pathname.startsWith("/add")) {
			const frombody = await request.json();
			const mystring = JSON.stringify(frombody);
		   
			//TODO: add real product reating and putting with eng name as a key and all product qualities as JSON 

			await env.KV.put("99999", mystring);
			return new Response(mystring, { headers: {
			  ...corsHeaders
			} });
		  }
		
		//default rout: to be change to something like "welcome"
		
		const valuefromKV = await env.KV.get("001")
		const stringValue = JSON.stringify(valuefromKV)
		return new Response(stringValue, { headers: {
			...corsHeaders
		  } });
	},
};
