import { ofetch } from 'ofetch';
import useSWR from 'swr';
import { useLocalStorage } from 'usehooks-ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from './components/ui/button';

type Img = {
  id: string;
  prompt: string;
  image: string;
};

const fetcher = (url: string) =>
  ofetch(url).then(({ rows }) =>
    rows.map((r: any) => ({
      id: r.row.id,
      prompt: r.row.content,
      image: r.row.url,
    }))
  );

const url =
  'https://datasets-server.huggingface.co/rows?dataset=vivym%2Fmidjourney-messages&config=default&split=train';

function App() {
  const [current, setCurrent] = useLocalStorage('current-prompt', 28);
  const offset = 100 * Math.floor(current / 100);
  const { data } = useSWR<Img[]>(url + `&offset=${offset}&length=100`, fetcher);

  return (
    <section className="container text-center mt-10">
      <h1 className="font-bold text-xl uppercase">
        {!data?.length ? 'Loading...' : 'Midjourney Prompts'}
      </h1>
      {!data?.length ? null : (
        <div className="mt-5 align-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Button
              variant="outline"
              onClick={() => setCurrent(Math.max(0, current - 1))}
            >
              <ChevronLeft />
            </Button>
            <div>Prompt #{current}</div>
            <Button variant="outline" onClick={() => setCurrent(current + 1)}>
              <ChevronRight />
            </Button>
          </div>
          <div className="mt-5">{data[current - offset].prompt}</div>
          <img className="m-auto" src={data[current - offset].image} />
        </div>
      )}
    </section>
  );
}

export default App;
