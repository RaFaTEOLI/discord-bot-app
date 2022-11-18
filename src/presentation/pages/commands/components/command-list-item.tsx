import { CommandModel } from '@/domain/models';
import { Box, Badge, Flex, IconButton } from '@chakra-ui/react';
import { HiEye } from 'react-icons/hi2';

type Props = {
  commands: CommandModel[];
  handleView: (command: CommandModel) => void;
};

export default function CommandListItem({ commands, handleView }: Props): JSX.Element {
  return (
    <Flex direction={['column', 'row']} flexWrap="wrap" gap={5} data-testid="commands-list">
      {commands.map(command => (
        <Box key={command.id} w="285px" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box p="6">
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
              !{command.command}
            </Box>

            <Box>{command.description}</Box>

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
                <IconButton
                  className="command-view-button"
                  variant="outline"
                  size="sm"
                  colorScheme="blue"
                  aria-label="View command"
                  icon={<HiEye />}
                  onClick={() => handleView(command)}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Flex>
  );
}
