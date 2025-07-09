import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { AxiosRequestConfig, Method } from 'axios';
import { ClientApi } from './ssc';
import { ServerResponse, IncomingMessage } from 'http';

const ClientApiSSR = async (
  req: any,
  res: ServerResponse<IncomingMessage>,
  url: string
) => {
  const session = await getServerSession(req, res, authOptions);

  const config: AxiosRequestConfig = {
    url,
    method: req?.method ? (req.method as Method) : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: session?.user?.accessToken
        ? `Bearer ${session?.user?.accessToken}`
        : undefined
    }
  };

  const { data } = await ClientApi.request(config);

  return data;
};

export { ClientApiSSR };
