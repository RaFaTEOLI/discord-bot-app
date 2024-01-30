import { CommandModel } from '@/domain/models';
import { Box, Badge, Flex, Grid, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { HiCloudArrowUp, HiEye } from 'react-icons/hi2';

type Props = {
  commands: CommandModel[];
  handleView: (command: CommandModel) => void;
  handleRun: (command: string) => void;
};

export default function CommandListItem({ commands, handleView, handleRun }: Props): JSX.Element {
  const color = useColorModeValue('gray.50', 'gray.900');
  return (
    <Flex direction="column" pr={9}>
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
                !{command.command}
              </Box>

              <Flex flexDir="column" justifyContent="space-between">
                <Box className="command-description" h="3rem">
                  {command.description}
                </Box>

                <Box display="flex" mt="2" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                      {command.type.toUpperCase()}
                    </Badge>
                    <Box
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      textTransform="uppercase"
                      ml="2"
                    >
                      {command.dispatcher.toUpperCase()}
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Tooltip label="View Command">
                      <IconButton
                        className="command-view-button"
                        variant="outline"
                        size="sm"
                        colorScheme="blue"
                        aria-label="View command"
                        icon={<HiEye />}
                        onClick={() => handleView(command)}
                      />
                    </Tooltip>
                    <Tooltip label="Run Command">
                      <IconButton
                        className="command-run-button"
                        variant="outline"
                        size="sm"
                        colorScheme="green"
                        aria-label="Run command"
                        icon={<HiCloudArrowUp />}
                        onClick={() => handleRun(command.command)}
                      />
                    </Tooltip>
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
