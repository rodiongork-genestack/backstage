/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useAnalytics, withAnalyticsDomain } from '@backstage/core-plugin-api';
import {
  Link as MaterialLink,
  LinkProps as MaterialLinkProps,
} from '@material-ui/core';
import React, { ElementType, MutableRefObject } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

type OptionalRef = MutableRefObject<any> | ((instance: any) => void) | null;

export const isExternalUri = (uri: string) => /^([a-z+.-]+):/.test(uri);

export type LinkProps = MaterialLinkProps &
  RouterLinkProps & {
    component?: ElementType<any>;
  };

declare function LinkType(props: LinkProps): JSX.Element;

/**
 * Thin wrapper on top of material-ui's Link component
 * Makes the Link to utilise react-router
 * Thin wrapper on top of material-ui's Link component, which...
 * - Makes the Link use react-router
 * - Captures Link clicks as analytics events.
 */
const ActualLink = withAnalyticsDomain(
  ({ inputRef, onClick, ...props }: LinkProps & { inputRef: OptionalRef }) => {
    const analytics = useAnalytics();
    const to = String(props.to);
    const external = isExternalUri(to);
    const newWindow = external && !!/^https?:/.exec(to);

    const handleClick = (event: React.MouseEvent<any, MouseEvent>) => {
      if (onClick !== undefined) {
        onClick(event);
      }
      analytics.captureEvent('click', to);
    };

    return external ? (
      // External links
      <MaterialLink
        ref={inputRef}
        href={to}
        onClick={handleClick}
        {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
        {...props}
      />
    ) : (
      // Interact with React Router for internal links
      <MaterialLink
        ref={inputRef}
        component={RouterLink}
        onClick={handleClick}
        {...props}
      />
    );
  },
  { componentName: 'Link' },
);

export const WrappedLink = React.forwardRef<any, LinkProps>((props, ref) => (
  <ActualLink {...props} inputRef={ref} />
));

// TODO(Rugvip): We use this as a workaround to make the exported type be a
//               function, which makes our API reference docs much nicer.
//               The first type to be exported gets priority, but it will
//               be thrown away when compiling to JS.
// @ts-ignore
export { LinkType as Link, WrappedLink as Link };
