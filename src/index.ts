import { Hono } from 'hono'
import businessRouter from '../routes/business.route'
import lipaRouter from '../routes/lipa.route'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'));

//Routes
app.route("/api/business", businessRouter);
app.route("/api/lipa", lipaRouter);


export default { 
  port: Bun.env.PORT, 
  fetch: app.fetch, 
} 