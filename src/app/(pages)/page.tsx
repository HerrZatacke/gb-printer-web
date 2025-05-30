import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import  MuiMarkdown from 'mui-markdown';
import MarkdownStack from '@/components/MarkdownStack';
import readme from '../../../README.md';

export default async function Home() {
  return (
    <Card>
      <CardContent>
        <MuiMarkdown options={{ wrapper: MarkdownStack }}>
          {readme}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
}
