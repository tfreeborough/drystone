import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import css from './HierarchyRenderer.module.scss';
import { Application } from 'drystone';
import Muted from '../../atoms/Muted/Muted.tsx';
import Topper from '../../atoms/Topper/Topper.tsx';

interface HierarchyRendererProps {
  application: Application;
}

function HierarchyRenderer({
  application,
}: HierarchyRendererProps): ReactElement {
  return (
    <div className={css.hierarchyRenderer}>
      <Topper>Hierarchy</Topper>
      {application.scenes.length === 0 && (
        <Muted>Scenes will appear here once you have created one.</Muted>
      )}
    </div>
  );
}

export default observer(HierarchyRenderer);
