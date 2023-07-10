import React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(e): ErrorBoundaryState {
    return { hasError: true, error: e.message };
  }

  componentDidMount(): void {
    window.addEventListener("error", this.handleError);
  }

  componentWillUnmount(): void {
    window.removeEventListener("error", this.handleError);
  }

  handleError = (event: ErrorEvent): void => {
    event.preventDefault();

    this.setState({
      hasError: true,
      error: new Error(event),
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            bottom="0"
            right="0"
            width="100%"
            height="100%"
            backgroundColor="rgba(0,0,0,0.5)"
          >
            <Paper
              style={{
                textAlign: "center",
                marginTop: "20%",
                marginLeft: "auto",
                marginRight: "auto",
                height: "200px",
                width: "300px",
              }}
              elevation={2}
              sx={{ p: 2 }}
            >
              <Typography variant="h6" component="h6">
                Oops Something went wrong....
              </Typography>
            </Paper>
          </Box>
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
