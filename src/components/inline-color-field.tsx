import { Box, Grid, Stack, Text } from '@sanity/ui';
import type { ObjectFieldProps } from 'sanity';

export const InlineColorField = (props: ObjectFieldProps) => {
  const { title, description, children, inputId } = props;

  return (
    <Stack gap={2}>
      <Grid gridTemplateColumns={2} style={{ alignItems: 'center' }}>
        <Text as="label" htmlFor={inputId} weight="medium" size={1}>
          {title}
        </Text>
        <Box>{children}</Box>
      </Grid>

      {description && (
        <Grid gridTemplateColumns={2}>
          <Box />
          <Text size={1} muted>
            {description}
          </Text>
        </Grid>
      )}
    </Stack>
  );
};
