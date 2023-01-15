import server from './src';

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`server started on port ${port}`);
});