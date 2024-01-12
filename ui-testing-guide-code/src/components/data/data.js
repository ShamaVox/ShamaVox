import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

export const Data = ({title, value, delta, onClick}) => {
    return (
        <Flex bg="white" p={8} flexDirection="column">
            {title && <Text fontSize="xs">{title}</Text>}
            {value && <Text fontSize="large">{value}</Text>}
            {delta && <Text fontSize="sm">{delta}</Text>}

            {onClick &&
                <Button
                    colorScheme='blue'
                    variant='outline'
                    role="button"
                    onClick={onClick}
                >
                    Button
                </Button>
            }
        </Flex>
    );
}
