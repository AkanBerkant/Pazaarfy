import BablOrientedTemplate1 from '../../components/templates/BablOriented/Template1';
import BablOrientedTemplate2 from '../../components/templates/BablOriented/Template2';
import BablOrientedTemplate3 from '../../components/templates/BablOriented/Template3';
import BablOrientedTemplate4 from '../../components/templates/BablOriented/Template4';
import BablOrientedTemplate5 from '../../components/templates/BablOriented/Template5';
import BablOrientedTemplate6 from '../../components/templates/BablOriented/Template6';
import BablOrientedTemplate7 from '../../components/templates/BablOriented/Template7';
import BablOrientedScrollableTemplate1 from '../../components/templates/BablOrientedScrollable/Template1';
import BablOrientedScrollableTemplate2 from '../../components/templates/BablOrientedScrollable/Template2';
import BablOrientedScrollableTemplate3 from '../../components/templates/BablOrientedScrollable/Template3';
import BablOrientedScrollableTemplate4 from '../../components/templates/BablOrientedScrollable/Template4';
import BablOrientedScrollableTemplate5 from '../../components/templates/BablOrientedScrollable/Template5';
import BablOrientedScrollableTemplate7 from '../../components/templates/BablOrientedScrollable/Template7';
import BackgroundOrientedTemplate1 from '../../components/templates/BackgroundOriented/Template1';
import BackgroundOrientedTemplate2 from '../../components/templates/BackgroundOriented/Template2';
import BackgroundOrientedTemplate3 from '../../components/templates/BackgroundOriented/Template3';
import BackgroundOrientedTemplate5 from '../../components/templates/BackgroundOriented/Template5';
import BackgroundOrientedTemplate6 from '../../components/templates/BackgroundOriented/Template6';
import BackgroundOrientedScrollableTemplate1 from '../../components/templates/BackgroundOrientedScrollable/Template1';
import BackgroundOrientedScrollableTemplate2 from '../../components/templates/BackgroundOrientedScrollable/Template2';
import BackgroundOrientedScrollableTemplate4 from '../../components/templates/BackgroundOrientedScrollable/Template4';
import BackgroundOrientedScrollableTemplate5 from '../../components/templates/BackgroundOrientedScrollable/Template5';
import BackgroundOrientedScrollableTemplate6 from '../../components/templates/BackgroundOrientedScrollable/Template6';
import BackgroundOrientedScrollableTemplate7 from '../../components/templates/BackgroundOrientedScrollable/Template7';
import BrandOrientedTemplate1 from '../../components/templates/BrandOriented/Template1';
import BrandOrientedTemplate2 from '../../components/templates/BrandOriented/Template2';
import BrandOrientedTemplate3 from '../../components/templates/BrandOriented/Template3';
import BrandOrientedTemplate4 from '../../components/templates/BrandOriented/Template4';
import BrandOrientedTemplate5 from '../../components/templates/BrandOriented/Template5';
import BrandOrientedTemplate6 from '../../components/templates/BrandOriented/Template6';
import EasyToConsumeTemplate1 from '../../components/templates/EasyToConsume/Template1';
import EasyToConsumeTemplate2 from '../../components/templates/EasyToConsume/Template2';
import EasyToConsumeTemplate3 from '../../components/templates/EasyToConsume/Template3';
import EasyToConsumeTemplate4 from '../../components/templates/EasyToConsume/Template4';
import EasyToConsumeTemplate5 from '../../components/templates/EasyToConsume/Template5';
import EasyToConsumeTemplate6 from '../../components/templates/EasyToConsume/Template6';
import EasyToConsumeTemplate7 from '../../components/templates/EasyToConsume/Template7';

export const templateCategories = [
  [
    {
      template: BablOrientedTemplate1,
      height: 932,
      chunkSize: 6,
      shouldReverse: true,
    },
    { template: BablOrientedTemplate2, height: 1233, chunkSize: 15 },
    { template: BablOrientedTemplate3, height: 854, chunkSize: 7 },
    { template: BablOrientedTemplate4, height: 941, chunkSize: 11 },
    {
      template: BablOrientedTemplate5,
      height: 1159,
      chunkSize: 6,
      shouldReverse: true,
    },
    { template: BablOrientedTemplate6, height: 978, chunkSize: 5 },
    {
      template: BablOrientedTemplate7,
      height: 1322,
      chunkSize: 8,
      shouldReverse: false,
    },
  ],
  [
    { template: BablOrientedScrollableTemplate1, height: 500, chunkSize: 14 },
    { template: BablOrientedScrollableTemplate2, height: 1058, chunkSize: 14 },
    { template: BablOrientedScrollableTemplate3, height: 1387, chunkSize: 15 },
    { template: BablOrientedScrollableTemplate4, height: 1344, chunkSize: 25 },
    { template: BablOrientedScrollableTemplate5, height: 1106, chunkSize: 14 },
    { template: BablOrientedScrollableTemplate7, height: 1139, chunkSize: 10 },
  ],
  [
    {
      template: BackgroundOrientedTemplate1,
      height: 1409,
      chunkSize: 7,
      shouldReverse: true,
    },
    { template: BackgroundOrientedTemplate2, height: 1196, chunkSize: 6 },
    {
      template: BackgroundOrientedTemplate3,
      height: 1388,
      chunkSize: 4,
      shouldReverse: true,
    },
    { template: BackgroundOrientedTemplate5, height: 850, chunkSize: 5 },
    { template: BackgroundOrientedTemplate6, height: 1000, chunkSize: 6 },
  ],
  [
    {
      template: BackgroundOrientedScrollableTemplate1,
      height: 1268,
      chunkSize: 9,
    },
    {
      template: BackgroundOrientedScrollableTemplate2,
      height: 800,
      chunkSize: 9,
    },
    {
      template: BackgroundOrientedScrollableTemplate4,
      height: 900,
      chunkSize: 11,
    },
    {
      template: BackgroundOrientedScrollableTemplate5,
      height: 1000,
      chunkSize: 12,
    },
    {
      template: BackgroundOrientedScrollableTemplate6,
      height: 1739,
      chunkSize: 10,
    },
    {
      template: BackgroundOrientedScrollableTemplate7,
      height: 1200,
      chunkSize: 16,
    },
  ],
  [
    { template: BrandOrientedTemplate1, height: 1296, chunkSize: 7 },
    { template: BrandOrientedTemplate2, height: 400, chunkSize: 3 },
    { template: BrandOrientedTemplate3, height: 936, chunkSize: 7 },
    // {template: BrandOrientedTemplate4, height: 1084, chunkSize: 9},
    { template: BrandOrientedTemplate5, height: undefined, chunkSize: 20 },
    { template: BrandOrientedTemplate6, height: 1296, chunkSize: 4 },
  ],
  [
    { template: EasyToConsumeTemplate1, height: 1131, chunkSize: 16 },
    { template: EasyToConsumeTemplate2, height: 1191, chunkSize: 12 },
    { template: EasyToConsumeTemplate3, height: 1171, chunkSize: 25 },
    { template: EasyToConsumeTemplate4, height: 1171, chunkSize: 10 },
    { template: EasyToConsumeTemplate5, height: 1508, chunkSize: 23 },
    { template: EasyToConsumeTemplate6, height: 1687, chunkSize: 16 },
    { template: EasyToConsumeTemplate7, height: 1970, chunkSize: 32 },
  ],
];
