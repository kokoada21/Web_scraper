import pg, { Pool } from "pg";

import express, { Request, Response } from 'express';
import cors from 'cors';

const pool: Pool = new pg.Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'database',
    port: 5432,
    database: 'postgres',
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
    res.send('[ { "id": 1385, "title": "For sale apartment 3+1 78 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QM_Kc/ILEBPjy.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" }, { "id": 1386, "title": "For sale apartment 2+kt 75 m²", "img_url": "https://d18-a.sdn.cz/d_18/c_img_QL_J4/3GD3zO.jpeg?fl=res,400,300,3|shr,,20|jpg,90" } ]');
});

app.get('/flats', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const start:number = parseInt(req.query.start as string);
        const end:number = parseInt(req.query.end as string);
        const selectQuery = `
        SELECT * FROM sreality
        OFFSET $1
        LIMIT $2
        `;
        const values = [start, end - start];
        client.query(selectQuery, values).then((result) => {
            res.send(result.rows);
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

const port: string = '3001';
app.listen(port, () => {
    console.log('Server is listening on port', port);
});
