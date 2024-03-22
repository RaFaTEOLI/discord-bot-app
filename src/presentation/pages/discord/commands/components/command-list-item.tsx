import { DiscordCommandModel } from '@/domain/models';
import { Box, Badge, Flex, Grid, useColorModeValue } from '@chakra-ui/react';

type Props = {
  commands: DiscordCommandModel[];
};

export default function CommandListItem({ commands }: Props): JSX.Element {
  const color = useColorModeValue('gray.50', 'gray.900');
  const applicationCommandTypes = ['', 'CHAT_INPUT', 'USER', 'MESSAGE'];
  return (
    <Flex direction="column">
      <Grid
        templateColumns={[
          'repeat(1, 1fr)',
          'repeat(1, 1fr)',
          'repeat(1, 1fr)',
          'repeat(2, 1fr)',
          'repeat(3, 1fr)',
          'repeat(4, 1fr)',
          'repeat(5, 1fr)',
          'repeat(6, 1fr)'
        ]}
        gap={5}
        data-testid="commands-list"
      >
        {commands.map(command => (
          <Box bgColor={color} key={command.id} w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1} className="command-name">
                {command.name}
              </Box>

              <Flex flexDir="column" justifyContent="space-between">
                <Box className="command-description" h="3rem">
                  {command.description}
                </Box>

                <Box display="flex" mt="2" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                      {applicationCommandTypes[command.type]}
                    </Badge>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        ))}
      </Grid>
    </Flex>
  );
}
